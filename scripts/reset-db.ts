/**
 * Vide TOUTES les données du site (les tables restent). Demande de taper OUI.
 * Usage : npm run prod:db:reset   (ou db:reset en local)
 */
import { Pool } from 'pg';
import 'dotenv/config';
import { createInterface } from 'readline/promises';

const TABLES = [
  'projects', 'messages', 'courses', 'notes', 'admin_sessions', 'admin_users',
  'site_settings', 'experiences', 'skills', 'documents',
];

async function main() {
  const target = `${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT ?? 5432}/${process.env.POSTGRES_DB}`;
  console.log(`Base cible : ${target}`);
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question('Cela efface toutes les données de cette base. Tape OUI pour confirmer : ');
  rl.close();
  if (answer.trim() !== 'OUI') { console.log('Annulé.'); return; }

  const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });
  // Seules les tables existantes sont vidées (la migration profil peut ne pas être appliquée)
  const { rows } = await pool.query(
    'SELECT tablename FROM pg_tables WHERE schemaname = $1 AND tablename = ANY($2)', ['public', TABLES]);
  const existing = rows.map((r) => r.tablename);
  if (existing.length) await pool.query(`TRUNCATE TABLE ${existing.join(', ')} RESTART IDENTITY CASCADE`);
  console.log(`Vidé : ${existing.join(', ') || '(aucune table)'}`);
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
