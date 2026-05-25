const axios = require('axios');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACES_BASE = 'https://places.googleapis.com/v1/places';
const RATE_LIMIT_MS = 200;

const SEARCH_QUERIES = [
  { template: 'MedSpa', niche: 'MedSpa' },
  { template: 'aesthetic clinic', niche: 'Aesthetic Clinic' },
  { template: 'dental clinic', niche: 'Dental' },
  { template: 'cosmetic clinic', niche: 'Aesthetic Clinic' },
  { template: 'hair transplant clinic', niche: 'Aesthetic Clinic' },
];

const CITIES = [
  { name: 'Johannesburg', country: 'South Africa' },
  { name: 'Cape Town', country: 'South Africa' },
  { name: 'Durban', country: 'South Africa' },
  { name: 'Pretoria', country: 'South Africa' },
  { name: 'Sandton', country: 'South Africa' },
  { name: 'London', country: 'United Kingdom' },
  { name: 'Manchester', country: 'United Kingdom' },
  { name: 'Birmingham', country: 'United Kingdom' },
  { name: 'Edinburgh', country: 'United Kingdom' },
  { name: 'Bristol', country: 'United Kingdom' },
  { name: 'New York', country: 'United States' },
  { name: 'Los Angeles', country: 'United States' },
  { name: 'Miami', country: 'United States' },
  { name: 'Houston', country: 'United States' },
  { name: 'Chicago', country: 'United States' },
  { name: 'Dallas', country: 'United States' },
  { name: 'Atlanta', country: 'United States' },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

function normalizeClinicName(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchExistingKeys() {
  const placeIds = new Set();
  const domains = new Set();
  const names = new Set();
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: DATABASE_ID,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const page of res.results) {
      const pid = page.properties['place_id']?.rich_text?.[0]?.text?.content;
      if (pid) placeIds.add(pid);

      const url =
        page.properties['Website']?.url ||
        page.properties['website']?.url;
      const d = domainFromUrl(url);
      if (d) domains.add(d);

      const clinicName =
        page.properties['Lead Name']?.title?.[0]?.text?.content ||
        page.properties['Company Name']?.rich_text?.[0]?.text?.content;
      const city =
        page.properties['Location']?.select?.name ||
        page.properties['city']?.rich_text?.[0]?.text?.content;
      const key = normalizeClinicName(clinicName);
      if (key) names.add(key);
      if (key && city) names.add(`${key}|${city.toLowerCase().trim()}`);
    }
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return { placeIds, domains, names };
}

function isDuplicate(existing, placeId, websiteUrl, clinicName, city) {
  if (placeId && existing.placeIds.has(placeId)) return 'place_id';
  const d = domainFromUrl(websiteUrl);
  if (d && existing.domains.has(d)) return 'website';
  const norm = normalizeClinicName(clinicName);
  if (norm && city && existing.names.has(`${norm}|${city.toLowerCase().trim()}`))
    return 'name+city';
  if (norm && existing.names.has(norm)) return 'name';
  return null;
}

function trackNewRecord(existing, placeId, websiteUrl, clinicName, city) {
  if (placeId) existing.placeIds.add(placeId);
  const d = domainFromUrl(websiteUrl);
  if (d) existing.domains.add(d);
  const norm = normalizeClinicName(clinicName);
  if (norm) existing.names.add(norm);
  if (norm && city) existing.names.add(`${norm}|${city.toLowerCase().trim()}`);
}

async function textSearch(query, city) {
  const res = await axios.post(
    `${PLACES_BASE}:searchText`,
    { textQuery: `${query} ${city}` },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': PLACES_KEY,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.rating,places.websiteUri,places.nationalPhoneNumber',
      },
    }
  );
  return res.data.places || [];
}

function parseCityFromAddress(address, searchCity) {
  if (!address) return searchCity;
  const parts = address.split(',').map((p) => p.trim());
  for (const part of parts) {
    if (part.toLowerCase().includes(searchCity.toLowerCase())) return searchCity;
  }
  return searchCity;
}

function buildLocation(country, city) {
  const c = (country || '').trim();
  const ci = (city || '').trim();
  if (c && ci) return `${c}, ${ci}`;
  return ci || c;
}

async function writeToNotion(lead) {
  const location = buildLocation(lead.country, lead.city);
  const properties = {
    'Lead Name': { title: [{ text: { content: lead.clinic_name || '' } }] },
    'Company Name': {
      rich_text: [{ text: { content: lead.clinic_name || '' } }],
    },
    'Website': lead.website ? { url: lead.website } : { url: null },
    'address': {
      rich_text: [{ text: { content: lead.address || '' } }],
    },
    'Location': location ? { select: { name: location } } : undefined,
    'Google Rating': { number: lead.google_rating || null },
    'niche': { select: { name: lead.niche } },
    'place_id': {
      rich_text: [{ text: { content: lead.place_id } }],
    },
    'pipeline_status': { select: { name: 'Scraped' } },
    'Source': { select: { name: 'Google Places' } },
  };
  if (lead.phone_raw) {
    properties['Phone'] = { phone_number: lead.phone_raw };
  }
  Object.keys(properties).forEach((k) => {
    if (properties[k] === undefined) delete properties[k];
  });
  await notion.pages.create({
    parent: { database_id: DATABASE_ID },
    properties,
  });
}

async function scraper() {
  console.log('\n=== SCRAPER: Google Places ===');
  const existing = await fetchExistingKeys();
  console.log(
    `Existing records: ${existing.placeIds.size} place_ids, ${existing.domains.size} domains, ${existing.names.size} names`
  );

  const stats = {
    searched: 0,
    found: 0,
    duplicates: 0,
    written: 0,
    errors: 0,
    lowRating: 0,
  };

  for (const city of CITIES) {
    for (const sq of SEARCH_QUERIES) {
      stats.searched++;

      try {
        const results = await textSearch(sq.template, city.name);
        await delay(RATE_LIMIT_MS);

        for (const place of results) {
          stats.found++;

          const placeId = place.id;
          const clinicName = place.displayName?.text || '';
          const websiteUrl = place.websiteUri || null;
          const parsedCity = parseCityFromAddress(
            place.formattedAddress,
            city.name
          );

          const dupReason = isDuplicate(
            existing,
            placeId,
            websiteUrl,
            clinicName,
            parsedCity
          );
          if (dupReason) {
            stats.duplicates++;
            continue;
          }

          if (place.rating && place.rating < 3.5) {
            stats.lowRating++;
            console.log(
              `  WARNING: Low rating (${place.rating}) for ${clinicName}`
            );
          }

          try {
            const lead = {
              clinic_name: clinicName,
              website: websiteUrl,
              address: place.formattedAddress || '',
              city: parsedCity,
              country: city.country,
              phone_raw: place.nationalPhoneNumber || null,
              google_rating: place.rating || null,
              niche: sq.niche,
              place_id: placeId,
            };

            await writeToNotion(lead);
            trackNewRecord(
              existing,
              placeId,
              websiteUrl,
              clinicName,
              parsedCity
            );
            stats.written++;
            console.log(
              `  + ${lead.clinic_name} (${city.name}, ${city.country})`
            );
          } catch (err) {
            stats.errors++;
            console.error(`  ERROR writing ${clinicName}: ${err.message}`);
          }
        }
      } catch (err) {
        stats.errors++;
        console.error(
          `  ERROR searching "${sq.template} ${city.name}": ${err.message}`
        );
      }
    }
  }

  console.log('\nScraper summary:');
  console.log(`  Queries run: ${stats.searched}`);
  console.log(`  Results found: ${stats.found}`);
  console.log(`  Duplicates skipped: ${stats.duplicates}`);
  console.log(`  New records written: ${stats.written}`);
  console.log(`  Low rating warnings: ${stats.lowRating}`);
  console.log(`  Errors: ${stats.errors}`);
  return stats;
}

module.exports = scraper;
