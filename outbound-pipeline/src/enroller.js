const axios = require('axios');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const APOLLO_KEY = process.env.APOLLO_API_KEY;
const APOLLO_BASE = 'https://api.apollo.io/v1';
const SEQUENCE_ID = process.env.APOLLO_SEQUENCE_ID;
const SENDING_EMAILS = process.env.SENDING_EMAIL.split(',').map((e) => e.trim()).filter(Boolean);
const DAILY_SEND_CAP = parseInt(process.env.DAILY_SEND_CAP, 10) || 20;

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
    case 'email':
      return p.email;
    case 'date':
      return p.date?.start || null;
    default:
      return null;
  }
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

async function countEnrolledToday() {
  const today = todayISO();
  let count = 0;
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: DATABASE_ID,
      start_cursor: cursor,
      page_size: 100,
      filter: {
        and: [
          { property: 'pipeline_status', select: { equals: 'Enrolled' } },
          { property: 'enrolled_date', date: { equals: today } },
        ],
      },
    });
    count += res.results.length;
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return count;
}

async function fetchReadyRecords() {
  const records = [];
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: DATABASE_ID,
      start_cursor: cursor,
      page_size: 100,
      filter: {
        and: [
          { property: 'pipeline_status', select: { equals: 'Enriched' } },
          { property: 'enrolled_date', date: { is_empty: true } },
        ],
      },
    });
    records.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return records;
}

async function enrollInSequence(personId, senderIndex) {
  const sender = SENDING_EMAILS[senderIndex % SENDING_EMAILS.length];
  const res = await axios.post(
    `${APOLLO_BASE}/emailer_campaigns/${SEQUENCE_ID}/add_contact_ids`,
    {
      contact_ids: [personId],
      send_email_from_email_address: sender,
    },
    { headers: { 'x-api-key': APOLLO_KEY, 'Content-Type': 'application/json' } }
  );
  return { data: res.data, sender };
}

async function enroller() {
  console.log('\n=== ENROLLER: Apollo Sequences ===');

  const enrolledToday = await countEnrolledToday();
  const remaining = DAILY_SEND_CAP - enrolledToday;
  console.log(`Sending accounts: ${SENDING_EMAILS.length} (${SENDING_EMAILS.join(', ')})`);
  console.log(`Already enrolled today: ${enrolledToday}`);
  console.log(`Daily cap: ${DAILY_SEND_CAP}`);
  console.log(`Slots remaining: ${remaining}`);

  if (remaining <= 0) {
    console.log('Daily send cap reached. No enrollments today.');
    return { processed: 0, enrolled: 0, errors: 0 };
  }

  const records = await fetchReadyRecords();
  console.log(`Verified records ready: ${records.length}`);

  const batch = records.slice(0, remaining);
  console.log(`Enrolling: ${batch.length}`);

  const stats = { processed: 0, enrolled: 0, errors: 0 };

  for (const page of batch) {
    const personId = prop(page, 'apollo_person_id');
    const clinicName = prop(page, 'clinic_name');
    const email = prop(page, 'email');
    stats.processed++;

    if (!personId) {
      console.log(`  - ${clinicName}: missing apollo_person_id, skipping`);
      stats.errors++;
      continue;
    }

    try {
      const result = await enrollInSequence(personId, stats.processed - 1);

      await notion.pages.update({
        page_id: page.id,
        properties: {
          pipeline_status: { select: { name: 'Enrolled' } },
          enrolled_date: { date: { start: todayISO() } },
        },
      });

      stats.enrolled++;
      console.log(`  + ${clinicName} (${email}) enrolled via ${result.sender}`);
    } catch (err) {
      stats.errors++;
      console.error(`  ERROR enrolling ${clinicName}: ${err.message}`);
    }
  }

  console.log(`\nEnroller summary:`);
  console.log(`  Processed: ${stats.processed}`);
  console.log(`  Enrolled: ${stats.enrolled}`);
  console.log(`  Errors: ${stats.errors}`);
  console.log(`  Total enrolled today: ${enrolledToday + stats.enrolled}`);
  return stats;
}

module.exports = enroller;
