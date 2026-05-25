const axios = require('axios');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const REQUIRED_ENV = [
  'GOOGLE_PLACES_API_KEY',
  'NOTION_TOKEN',
  'NOTION_DATABASE_ID',
  'APIFY_TOKEN',
];

const NOTION_PROPERTIES = {
  clinic_name: { type: 'title' },
  website: { type: 'url', url: {} },
  address: { type: 'rich_text', rich_text: {} },
  city: { type: 'rich_text', rich_text: {} },
  country: {
    type: 'select',
    select: {
      options: [
        { name: 'South Africa' },
        { name: 'United Kingdom' },
        { name: 'United States' },
      ],
    },
  },
  phone_raw: { type: 'phone_number', phone_number: {} },
  google_rating: { type: 'number', number: { format: 'number' } },
  niche: {
    type: 'select',
    select: {
      options: [
        { name: 'MedSpa' },
        { name: 'Dental' },
        { name: 'Aesthetic Clinic' },
      ],
    },
  },
  place_id: { type: 'rich_text', rich_text: {} },
  email: { type: 'email', email: {} },
  enrichment_source: {
    type: 'select',
    select: { options: [{ name: 'Apify' }, { name: 'Manual' }, { name: 'Missing' }] },
  },
  pipeline_status: {
    type: 'select',
    select: {
      options: [
        { name: 'Scraped' },
        { name: 'Enriched' },
        { name: 'Contacted' },
        { name: 'Replied' },
        { name: 'Skipped' },
      ],
    },
  },
  notes: { type: 'rich_text', rich_text: {} },
};

function pass(label) {
  console.log(`  PASS  ${label}`);
}

function fail(label, reason) {
  console.log(`  FAIL  ${label} — ${reason}`);
}

async function checkEnv() {
  console.log('\n1. Environment variables');
  let allPresent = true;
  for (const key of REQUIRED_ENV) {
    const val = process.env[key];
    if (!val || val.trim() === '') {
      fail(key, 'missing or empty');
      allPresent = false;
    } else {
      pass(key);
    }
  }
  return allPresent;
}

async function checkNotion() {
  console.log('\n2. Notion API');
  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    const db = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    });
    pass(`Connected to database: ${db.title?.[0]?.text?.content || db.id}`);

    console.log('\n3. Notion database properties');
    const existing = Object.keys(db.properties);
    const missing = [];

    for (const [name, schema] of Object.entries(NOTION_PROPERTIES)) {
      if (name === 'clinic_name') {
        const hasTitleProp = Object.values(db.properties).some(
          (p) => p.type === 'title'
        );
        if (hasTitleProp) {
          pass(`${name} (title)`);
        } else {
          fail(name, 'no title property found');
          missing.push(name);
        }
        continue;
      }

      if (existing.includes(name)) {
        pass(name);
      } else {
        fail(name, 'missing — will create');
        missing.push(name);
      }
    }

    if (missing.length > 0) {
      console.log(`\n   Creating ${missing.length} missing properties...`);
      const propsToCreate = {};
      for (const name of missing) {
        if (name === 'clinic_name') continue;
        const schema = NOTION_PROPERTIES[name];
        const propDef = { ...schema };
        delete propDef.type;
        propsToCreate[name] = propDef;
      }
      if (Object.keys(propsToCreate).length > 0) {
        await notion.databases.update({
          database_id: process.env.NOTION_DATABASE_ID,
          properties: propsToCreate,
        });
        pass('Missing properties created');
      }
    }

    return true;
  } catch (err) {
    fail('Notion connection', err.message);
    return false;
  }
}

async function checkApify() {
  console.log('\n4. Apify API');
  const token = process.env.APIFY_TOKEN || process.env.APIFY_API_TOKEN;
  if (!token) {
    fail('Apify', 'APIFY_TOKEN not set');
    return false;
  }
  try {
    const res = await axios.get('https://api.apify.com/v2/users/me', {
      params: { token },
    });
    const plan = res.data?.data?.plan?.id || 'unknown';
    const usage = res.data?.data?.plan?.usageTotal?.usd;
    pass(`Connected (plan: ${plan}${usage != null ? `, usage: $${usage}` : ''})`);
    return true;
  } catch (err) {
    fail('Apify API', err.response?.data?.error?.message || err.message);
    return false;
  }
}

async function checkGooglePlaces() {
  console.log('\n5. Google Places API');
  try {
    const res = await axios.post(
      'https://places.googleapis.com/v1/places:searchText',
      { textQuery: 'MedSpa London' },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName',
        },
      }
    );
    const count = res.data.places?.length || 0;
    if (count > 0) {
      pass(`API key valid (${count} results for test query)`);
      return true;
    }
    fail('Google Places', 'no results returned for test query');
    return false;
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    fail('Google Places API', msg);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('APEX LEAD PIPELINE — PRE-FLIGHT CHECKS');
  console.log('='.repeat(60));

  const results = [];
  results.push(await checkEnv());
  results.push(await checkNotion());
  results.push(await checkApify());
  results.push(await checkGooglePlaces());

  console.log('\n' + '='.repeat(60));
  if (results.every(Boolean)) {
    console.log('ALL CHECKS PASSED — pipeline is ready to run');
    console.log('Next step: npm run run-now');
  } else {
    console.log('SOME CHECKS FAILED — fix the issues above before running');
  }
  console.log('='.repeat(60));
}

main().catch((err) => {
  console.error(`Setup crashed: ${err.message}`);
  process.exit(1);
});
