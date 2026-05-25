const axios = require('axios');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const APIFY_TOKEN = process.env.APIFY_TOKEN || process.env.APIFY_API_TOKEN;
const BATCH_SIZE = parseInt(process.env.ENRICHER_BATCH_SIZE, 10) || 25;
const DAILY_CAP = parseInt(process.env.ENRICHER_DAILY_CAP, 10) || 150;

function prop(page, name) {
  const p = page.properties[name];
  if (!p) return null;
  switch (p.type) {
    case 'title':
      return p.title[0]?.text?.content || null;
    case 'rich_text':
      return p.rich_text[0]?.text?.content || null;
    case 'select':
      return p.select?.name || null;
    case 'url':
      return p.url;
    case 'email':
      return p.email;
    case 'phone_number':
      return p.phone_number;
    case 'number':
      return p.number;
    default:
      return null;
  }
}

function domainFromUrl(value) {
  if (!value) return '';
  let url = value.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    return new URL(url).hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return '';
  }
}

async function fetchScrapedRecords() {
  const records = [];
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: DATABASE_ID,
      start_cursor: cursor,
      page_size: 100,
      filter: {
        and: [
          { property: 'pipeline_status', select: { equals: 'Scraped' } },
          { property: 'Website', url: { is_not_empty: true } },
        ],
      },
    });
    records.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return records;
}

const PAGE_FUNCTION = String.raw`async function pageFunction(context) {
  const { $, request } = context;
  const clean = (v) => (v || '').replace(/\s+/g, ' ').trim();
  const abs = (href) => {
    try { return new URL(href, request.loadedUrl || request.url).href; } catch { return ''; }
  };
  const unique = (arr) => [...new Set(arr.filter(Boolean))];
  const domain = request.userData.domain;

  const bodyText = clean($('body').text());
  const links = $('a[href]').map((_, el) => abs($(el).attr('href'))).get();
  const linkedin = links.find(u => /linkedin\.com\/company\//i.test(u)) || '';

  const phones = unique(
    (bodyText.match(/(?:\+?\d[\d\s().-]{7,}\d)/g) || []).map(clean)
  );

  const mailtos = $('a[href^="mailto:"]').map((_, el) => {
    return ($(el).attr('href') || '').replace('mailto:', '').split('?')[0].trim().toLowerCase();
  }).get();
  const textEmails = bodyText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const emails = unique([...mailtos, ...textEmails])
    .filter(e => !/(example|test|sentry|wixpress|placeholder)/i.test(e));

  const jsonLd = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).contents().text());
      const nodes = Array.isArray(parsed) ? parsed : [parsed];
      for (const node of nodes) {
        if (node && Array.isArray(node['@graph'])) jsonLd.push(...node['@graph']);
        else if (node) jsonLd.push(node);
      }
    } catch {}
  });

  const biz = jsonLd.find(n => {
    const t = n && n['@type'];
    const types = Array.isArray(t) ? t : [t];
    return types.some(v =>
      /Business|Organization|Medical|Dentist|LocalBusiness|Clinic/i.test(String(v || ''))
    );
  }) || {};

  const addr = biz.address || {};
  const sameAs = Array.isArray(biz.sameAs) ? biz.sameAs : [biz.sameAs].filter(Boolean);
  const schemaLinkedin = sameAs.find(u => /linkedin\.com/i.test(u)) || '';

  return {
    domain,
    url: request.loadedUrl || request.url,
    phone: clean(biz.telephone) || phones[0] || '',
    email: clean(biz.email) || emails[0] || '',
    linkedin: schemaLinkedin || linkedin,
    address: {
      street: clean(addr.streetAddress),
      city: clean(addr.addressLocality),
      state: clean(addr.addressRegion),
      country: clean(
        addr.addressCountry && (addr.addressCountry.name || addr.addressCountry)
      ),
    },
  };
}`;

async function callApify(domains) {
  const startUrls = domains.flatMap((d) =>
    ['', '/contact', '/contact-us', '/about', '/about-us'].map((suffix) => ({
      url: `https://${d}${suffix}`,
      userData: { domain: d },
    }))
  );

  const response = await axios.post(
    'https://api.apify.com/v2/acts/apify~cheerio-scraper/run-sync-get-dataset-items',
    {
      startUrls,
      maxRequestsPerCrawl: domains.length * 5,
      pageFunction: PAGE_FUNCTION,
    },
    {
      params: { token: APIFY_TOKEN, timeout: 300 },
      headers: { 'Content-Type': 'application/json' },
      timeout: 360000,
    }
  );

  return Array.isArray(response.data) ? response.data : [response.data];
}

function mergeByDomain(items) {
  const merged = new Map();
  for (const item of items) {
    const d = item.domain;
    if (!d) continue;
    const prev = merged.get(d) || {};
    merged.set(d, {
      phone: prev.phone || item.phone || '',
      email: prev.email || item.email || '',
      linkedin: prev.linkedin || item.linkedin || '',
      address: {
        street: prev.address?.street || item.address?.street || '',
        city: prev.address?.city || item.address?.city || '',
        state: prev.address?.state || item.address?.state || '',
        country: prev.address?.country || item.address?.country || '',
      },
    });
  }
  return merged;
}

function buildLocation(country, city) {
  const c = (country || '').trim();
  const ci = (city || '').trim();
  if (c && ci) return `${c}, ${ci}`;
  return ci || c;
}

async function updateRecord(pageId, data, current) {
  const properties = {
    'enrichment_source': { select: { name: 'Apify' } },
    'pipeline_status': { select: { name: 'Enriched' } },
  };

  if (data.phone && !current.phone) {
    properties['Phone'] = { phone_number: data.phone };
  }
  if (data.email && !current.email) {
    properties['Work Email'] = { email: data.email };
  }
  if (data.linkedin && !current.linkedin) {
    properties['LinkedIn URL'] = { url: data.linkedin };
  }
  if (data.address?.street && !current.address) {
    const parts = [
      data.address.street,
      data.address.city,
      data.address.state,
    ].filter(Boolean);
    properties['address'] = {
      rich_text: [{ text: { content: parts.join(', ') } }],
    };
  }
  if (!current.location) {
    const location = buildLocation(data.address?.country, data.address?.city);
    if (location) {
      properties['Location'] = { select: { name: location } };
    }
  }

  await notion.pages.update({ page_id: pageId, properties });
}

async function enricher() {
  console.log('\n=== ENRICHER: Apify Website Scraper ===');

  if (!APIFY_TOKEN) {
    console.log('WARNING: No APIFY_TOKEN set. Skipping enrichment.');
    return { processed: 0, enriched: 0, skipped: 0, errors: 0 };
  }

  const allRecords = await fetchScrapedRecords();
  const records = allRecords.slice(0, DAILY_CAP);
  console.log(
    `Records to enrich: ${records.length} (of ${allRecords.length} total, cap: ${DAILY_CAP})`
  );

  if (records.length === 0) {
    return { processed: 0, enriched: 0, skipped: 0, errors: 0 };
  }

  const domainToPages = new Map();
  for (const page of records) {
    const d = domainFromUrl(prop(page, 'Website'));
    if (!d) continue;
    if (!domainToPages.has(d)) domainToPages.set(d, []);
    domainToPages.get(d).push(page);
  }

  const domains = [...domainToPages.keys()];
  console.log(`Unique domains: ${domains.length}`);

  const stats = { processed: 0, enriched: 0, skipped: 0, errors: 0 };

  for (let i = 0; i < domains.length; i += BATCH_SIZE) {
    const batch = domains.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(domains.length / BATCH_SIZE);
    console.log(`\nBatch ${batchNum}/${totalBatches} (${batch.length} domains)`);

    let merged;
    try {
      const items = await callApify(batch);
      merged = mergeByDomain(items);
    } catch (err) {
      console.error(`  BATCH ERROR: ${err.message}`);
      stats.errors += batch.reduce(
        (sum, d) => sum + (domainToPages.get(d)?.length || 0),
        0
      );
      continue;
    }

    for (const d of batch) {
      const data = merged.get(d);
      const pages = domainToPages.get(d) || [];

      for (const page of pages) {
        stats.processed++;
        const name = prop(page, 'Lead Name');

        if (!data || (!data.phone && !data.email)) {
          stats.skipped++;
          try {
            await notion.pages.update({
              page_id: page.id,
              properties: {
                'enrichment_source': { select: { name: 'Apify' } },
                'pipeline_status': { select: { name: 'Enriched' } },
              },
            });
          } catch {}
          console.log(`  - ${name}: no contact data found`);
          continue;
        }

        try {
          const current = {
            phone: prop(page, 'Phone'),
            email: prop(page, 'Work Email'),
            linkedin: prop(page, 'LinkedIn URL'),
            address: prop(page, 'address'),
            location: prop(page, 'Location'),
          };

          await updateRecord(page.id, data, current);
          stats.enriched++;

          const found = [];
          if (data.phone) found.push(data.phone);
          if (data.email) found.push(data.email);
          if (data.linkedin) found.push('linkedin');
          console.log(`  + ${name}: ${found.join(', ')}`);
        } catch (err) {
          stats.errors++;
          console.error(`  ERROR ${name}: ${err.message}`);
        }
      }
    }
  }

  console.log('\nEnricher summary:');
  console.log(`  Processed: ${stats.processed}`);
  console.log(`  Enriched: ${stats.enriched}`);
  console.log(`  Skipped (no data): ${stats.skipped}`);
  console.log(`  Errors: ${stats.errors}`);
  return stats;
}

module.exports = enricher;
