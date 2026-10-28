/**
 * Importe les CV (PDF + DOCX) du dossier cv_seed/ dans la base.
 * Ne remplace pas un CV déjà en ligne, sauf avec --force (qui ajoute alors une nouvelle version).
 *
 * Fichiers attendus : CV_Abdoulaye_<Profil>_<FR|EN>.<pdf|docx>
 * Usage : npx tsx scripts/import-cvs.ts [dossier] [--force]
 **/

import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import 'dotenv/config';

const PROFILES: Record<string, { slug: string; fr: string; en: string }> = {
  Machine_Learning: { slug: 'ml',       fr: 'AI / Machine Learning',            en: 'AI / Machine Learning' },
  MLOps:            { slug: 'mlops',    fr: 'MLOps / ML Engineering',           en: 'MLOps / ML Engineering' },
  AI_Research:      { slug: 'research', fr: 'Recherche en IA / R&D',            en: 'AI Research / R&D' },
  Data_AI:          { slug: 'data',     fr: 'Data Science / IA appliquée',      en: 'Data Science / Applied AI' },
  '3D_Vision_Twins':{ slug: 'vision3d', fr: '3D / Vision / Jumeaux numériques', en: '3D / Vision / Digital Twins' },
};
const MIME: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const dir = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'cv_seed';
const force = process.argv.includes('--force');

async function main() {
  const pool = new Pool({
    host:     process.env.POSTGRES_HOST,
    port:     process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
    user:     process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl:      process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });

  let added = 0, skipped = 0;
  for (const file of readdirSync(dir).sort()) {
    const m = /^CV_Abdoulaye_(.+)_(FR|EN)\.(pdf|docx)$/.exec(file);
    if (!m || !PROFILES[m[1]]) continue;
    const p = PROFILES[m[1]];
    const lang = m[2].toLowerCase();
    const format = m[3];
    const slug = `${p.slug}-${lang}`;

    const { rows: cur } = await pool.query(
      'SELECT 1 FROM documents WHERE slug = $1 AND format = $2 AND is_current', [slug, format]);
    if (cur.length && !force) { skipped++; continue; }

    const data = readFileSync(join(dir, file));
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows: v } = await client.query(
        'SELECT COALESCE(MAX(version), 0) + 1 AS next FROM documents WHERE slug = $1 AND format = $2', [slug, format]);
      await client.query('UPDATE documents SET is_current = false WHERE slug = $1 AND format = $2 AND is_current', [slug, format]);
      await client.query(
        `INSERT INTO documents (slug, format, label_fr, label_en, filename, mime, size_bytes, data, version, is_current, is_public)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true,true)`,
        [slug, format, `${p.fr} (${lang.toUpperCase()})`, `${p.en} (${lang.toUpperCase()})`, file, MIME[format], data.length, data, v[0].next]);
      await client.query('COMMIT');
      added++;
      console.log(`  + /cv/${slug}.${format}  (v${v[0].next})`);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
  console.log(`Terminé : ${added} ajouté(s), ${skipped} déjà en ligne (ignoré(s)).`);
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
