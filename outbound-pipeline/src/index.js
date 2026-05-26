const cron = require('node-cron');
require('dotenv').config();

const scraper = require('./scraper');
const enricher = require('./enricher');

const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 6 * * *';

async function debugSchema() {
  const { Client } = require('@notionhq/client');
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const db = await notion.databases.retrieve({ database_id: process.env.NOTION_DATABASE_ID });
  console.log('\n=== DATABASE SCHEMA ===');
  console.log(`Title: ${db.title?.map(t => t.plain_text).join('')}`);
  for (const [name, prop] of Object.entries(db.properties)) {
    console.log(`  "${name}" => ${prop.type}`);
  }
  console.log('=== END SCHEMA ===\n');
}

async function runPipeline() {
  await debugSchema();
  const startTime = Date.now();
  console.log('='.repeat(60));
  console.log(`APEX LEAD PIPELINE — ${new Date().toISOString()}`);
  console.log('='.repeat(60));

  const results = {};

  try {
    const t1 = Date.now();
    results.scraper = await scraper();
    console.log(`Scraper completed in ${((Date.now() - t1) / 1000).toFixed(1)}s`);
  } catch (err) {
    console.error(`SCRAPER FAILED: ${err.message}`);
    results.scraper = { error: err.message };
  }

  try {
    const t2 = Date.now();
    results.enricher = await enricher();
    console.log(`Enricher completed in ${((Date.now() - t2) / 1000).toFixed(1)}s`);
  } catch (err) {
    console.error(`ENRICHER FAILED: ${err.message}`);
    results.enricher = { error: err.message };
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('DAILY SUMMARY');
  console.log('='.repeat(60));
  console.log(`  New clinics found: ${results.scraper?.written ?? 'FAILED'}`);
  console.log(`  Enriched:          ${results.enricher?.enriched ?? 'FAILED'}`);
  console.log(`  No data found:     ${results.enricher?.skipped ?? '-'}`);
  console.log(`  Errors:            ${(results.scraper?.errors || 0) + (results.enricher?.errors || 0)}`);
  console.log(`  Total runtime:     ${totalTime}s`);
  console.log('='.repeat(60));
}

const isManualRun = process.argv.includes('--run-now');

if (isManualRun) {
  console.log('Manual run triggered (--run-now)');
  runPipeline()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(`Pipeline crashed: ${err.message}`);
      process.exit(1);
    });
} else {
  console.log(`Pipeline scheduled: ${CRON_SCHEDULE}`);
  console.log('Waiting for next scheduled run... (Ctrl+C to stop)');

  cron.schedule(CRON_SCHEDULE, () => {
    runPipeline().catch((err) => {
      console.error(`Pipeline crashed: ${err.message}`);
    });
  });
}
