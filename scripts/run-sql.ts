/**
 * Apply a .sql file to the database. Used to deploy the schema and seeds.
 *
 * Usage:
 * npx tsx scripts/run-sql.ts app/schema.sql
 * npx tsx scripts/run-sql.ts scripts/seed-projects.sql
 *
 * Set environment variables first:
 * POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
 **/

import { readFileSync } from 'fs';
import { Pool } from 'pg';
import 'dotenv/config';

const file = process.argv[2];
if (!file) {
  console.error('Usage: npx tsx scripts/run-sql.ts <path-to-sql-file>');
  process.exit(1);
}

async function main() {
  const sql = readFileSync(file, 'utf-8');

  const pool = new Pool({
    host:     process.env.POSTGRES_HOST,
    port:     process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
    user:     process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });

  await pool.query(sql);
  console.log(`Applied ${file}`);

  await pool.end();
}

main().catch((err) => { console.error(err); process.exit(1); });
