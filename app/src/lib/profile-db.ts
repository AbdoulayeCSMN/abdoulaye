import dbPool from '@lib/pg-client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Experience {
  id: string;
  kind: 'work' | 'education';
  org: string;
  role_fr: string;
  role_en: string;
  period_fr: string;
  period_en: string;
  description_fr: string;
  description_en: string;
  sort_order: number;
  is_published: boolean;
}

export interface Skill {
  id: string;
  name_fr: string;
  name_en: string;
  detail_fr: string;
  detail_en: string;
  sort_order: number;
  is_published: boolean;
}

export interface DocumentMeta {
  id: string;
  slug: string;
  format: 'pdf' | 'docx';
  label_fr: string;
  label_en: string;
  filename: string;
  mime: string;
  size_bytes: number;
  version: number;
  is_current: boolean;
  is_public: boolean;
  download_count: number;
  created_at: string;
}

export type Settings = Record<string, { fr: string; en: string }>;

const DOC_COLUMNS =
  'id, slug, format, label_fr, label_en, filename, mime, size_bytes, version, is_current, is_public, download_count, created_at';

// ─── Réglages (textes libres) ─────────────────────────────────────────────────

export async function getSettings(): Promise<Settings> {
  const { rows } = await dbPool.query('SELECT key, value_fr, value_en FROM site_settings');
  const out: Settings = {};
  for (const r of rows) out[r.key] = { fr: r.value_fr, en: r.value_en };
  return out;
}

const ALLOWED_SETTINGS = ['about_intro_1', 'about_intro_2', 'learning_line'];

export async function saveSettings(entries: Settings): Promise<void> {
  for (const [key, v] of Object.entries(entries)) {
    if (!ALLOWED_SETTINGS.includes(key)) continue;
    await dbPool.query(
      `INSERT INTO site_settings (key, value_fr, value_en) VALUES ($1, $2, $3)
       ON CONFLICT (key) DO UPDATE SET value_fr = EXCLUDED.value_fr, value_en = EXCLUDED.value_en, updated_at = CURRENT_TIMESTAMP`,
      [key, String(v.fr ?? '').slice(0, 4000), String(v.en ?? '').slice(0, 4000)],
    );
  }
}

// ─── Expériences / formation ──────────────────────────────────────────────────

export async function listExperiences(includeHidden = false): Promise<Experience[]> {
  const { rows } = await dbPool.query(
    `SELECT * FROM experiences ${includeHidden ? '' : 'WHERE is_published = true'} ORDER BY kind, sort_order, created_at DESC`,
  );
  return rows;
}

type ExperienceInput = Omit<Experience, 'id'>;

function cleanExperience(b: Partial<ExperienceInput>): ExperienceInput {
  const s = (v: unknown, n = 2000) => String(v ?? '').slice(0, n);
  return {
    kind: b.kind === 'education' ? 'education' : 'work',
    org: s(b.org, 200),
    role_fr: s(b.role_fr, 200),
    role_en: s(b.role_en, 200),
    period_fr: s(b.period_fr, 120),
    period_en: s(b.period_en, 120),
    description_fr: s(b.description_fr),
    description_en: s(b.description_en),
    sort_order: Number.isFinite(Number(b.sort_order)) ? Number(b.sort_order) : 0,
    is_published: b.is_published ?? true,
  };
}

export async function createExperience(b: Partial<ExperienceInput>): Promise<Experience> {
  const e = cleanExperience(b);
  if (!e.org || !e.role_fr) throw new Error('org and role_fr are required');
  const { rows } = await dbPool.query(
    `INSERT INTO experiences (kind, org, role_fr, role_en, period_fr, period_en, description_fr, description_en, sort_order, is_published)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [e.kind, e.org, e.role_fr, e.role_en, e.period_fr, e.period_en, e.description_fr, e.description_en, e.sort_order, e.is_published],
  );
  return rows[0];
}

export async function updateExperience(id: string, b: Partial<ExperienceInput>): Promise<Experience | null> {
  const e = cleanExperience(b);
  if (!e.org || !e.role_fr) throw new Error('org and role_fr are required');
  const { rows } = await dbPool.query(
    `UPDATE experiences SET kind=$2, org=$3, role_fr=$4, role_en=$5, period_fr=$6, period_en=$7,
       description_fr=$8, description_en=$9, sort_order=$10, is_published=$11 WHERE id=$1 RETURNING *`,
    [id, e.kind, e.org, e.role_fr, e.role_en, e.period_fr, e.period_en, e.description_fr, e.description_en, e.sort_order, e.is_published],
  );
  return rows[0] ?? null;
}

export async function deleteExperience(id: string): Promise<boolean> {
  const { rowCount } = await dbPool.query('DELETE FROM experiences WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}

// ─── Compétences ──────────────────────────────────────────────────────────────

export async function listSkills(includeHidden = false): Promise<Skill[]> {
  const { rows } = await dbPool.query(
    `SELECT * FROM skills ${includeHidden ? '' : 'WHERE is_published = true'} ORDER BY sort_order, created_at`,
  );
  return rows;
}

type SkillInput = Omit<Skill, 'id'>;

function cleanSkill(b: Partial<SkillInput>): SkillInput {
  const s = (v: unknown, n = 1000) => String(v ?? '').slice(0, n);
  return {
    name_fr: s(b.name_fr, 200),
    name_en: s(b.name_en, 200),
    detail_fr: s(b.detail_fr),
    detail_en: s(b.detail_en),
    sort_order: Number.isFinite(Number(b.sort_order)) ? Number(b.sort_order) : 0,
    is_published: b.is_published ?? true,
  };
}

export async function createSkill(b: Partial<SkillInput>): Promise<Skill> {
  const k = cleanSkill(b);
  if (!k.name_fr) throw new Error('name_fr is required');
  const { rows } = await dbPool.query(
    `INSERT INTO skills (name_fr, name_en, detail_fr, detail_en, sort_order, is_published)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [k.name_fr, k.name_en, k.detail_fr, k.detail_en, k.sort_order, k.is_published],
  );
  return rows[0];
}

export async function updateSkill(id: string, b: Partial<SkillInput>): Promise<Skill | null> {
  const k = cleanSkill(b);
  if (!k.name_fr) throw new Error('name_fr is required');
  const { rows } = await dbPool.query(
    `UPDATE skills SET name_fr=$2, name_en=$3, detail_fr=$4, detail_en=$5, sort_order=$6, is_published=$7
     WHERE id=$1 RETURNING *`,
    [id, k.name_fr, k.name_en, k.detail_fr, k.detail_en, k.sort_order, k.is_published],
  );
  return rows[0] ?? null;
}

export async function deleteSkill(id: string): Promise<boolean> {
  const { rowCount } = await dbPool.query('DELETE FROM skills WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}

// ─── Documents (CV) ───────────────────────────────────────────────────────────

/** Tous les documents (toutes versions), sans le contenu binaire — pour l'admin. */
export async function listDocuments(): Promise<DocumentMeta[]> {
  const { rows } = await dbPool.query(
    `SELECT ${DOC_COLUMNS} FROM documents ORDER BY slug, format, version DESC`,
  );
  return rows;
}

/** Versions courantes et publiques — pour la page « À propos ». */
export async function listPublicDocuments(): Promise<DocumentMeta[]> {
  const { rows } = await dbPool.query(
    `SELECT ${DOC_COLUMNS} FROM documents WHERE is_current AND is_public ORDER BY slug, format`,
  );
  return rows;
}

export async function getCurrentDocument(slug: string, format: string) {
  const { rows } = await dbPool.query(
    `SELECT id, filename, mime, data FROM documents
     WHERE slug = $1 AND format = $2 AND is_current AND is_public`,
    [slug, format],
  );
  return rows[0] as { id: string; filename: string; mime: string; data: Buffer } | undefined;
}

export async function incrementDownload(id: string): Promise<void> {
  await dbPool.query('UPDATE documents SET download_count = download_count + 1 WHERE id = $1', [id]);
}

/** Ajoute une nouvelle version (devient la version courante ; l'ancienne reste restaurable). */
export async function addDocumentVersion(d: {
  slug: string;
  format: 'pdf' | 'docx';
  label_fr: string;
  label_en: string;
  filename: string;
  mime: string;
  data: Buffer;
  is_public: boolean;
}): Promise<DocumentMeta> {
  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');
    const { rows: v } = await client.query(
      'SELECT COALESCE(MAX(version), 0) + 1 AS next FROM documents WHERE slug = $1 AND format = $2',
      [d.slug, d.format],
    );
    await client.query('UPDATE documents SET is_current = false WHERE slug = $1 AND format = $2 AND is_current', [d.slug, d.format]);
    const { rows } = await client.query(
      `INSERT INTO documents (slug, format, label_fr, label_en, filename, mime, size_bytes, data, version, is_current, is_public)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true,$10) RETURNING ${DOC_COLUMNS}`,
      [d.slug, d.format, d.label_fr, d.label_en, d.filename, d.mime, d.data.length, d.data, v[0].next, d.is_public],
    );
    await client.query('COMMIT');
    return rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

/** Restaure une ancienne version comme version courante. */
export async function makeDocumentCurrent(id: string): Promise<DocumentMeta | null> {
  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');
    const { rows: cur } = await client.query('SELECT slug, format FROM documents WHERE id = $1', [id]);
    if (!cur[0]) { await client.query('ROLLBACK'); return null; }
    await client.query('UPDATE documents SET is_current = false WHERE slug = $1 AND format = $2 AND is_current', [cur[0].slug, cur[0].format]);
    const { rows } = await client.query(`UPDATE documents SET is_current = true WHERE id = $1 RETURNING ${DOC_COLUMNS}`, [id]);
    await client.query('COMMIT');
    return rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function updateDocumentMeta(
  slug: string,
  format: string,
  b: { label_fr?: string; label_en?: string; is_public?: boolean },
): Promise<boolean> {
  const { rowCount } = await dbPool.query(
    `UPDATE documents SET label_fr = COALESCE($3, label_fr), label_en = COALESCE($4, label_en), is_public = COALESCE($5, is_public)
     WHERE slug = $1 AND format = $2`,
    [slug, format, b.label_fr ?? null, b.label_en ?? null, b.is_public ?? null],
  );
  return (rowCount ?? 0) > 0;
}

/** Supprime une version ; si c'était la courante, la plus récente restante la remplace. */
export async function deleteDocument(id: string): Promise<boolean> {
  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('DELETE FROM documents WHERE id = $1 RETURNING slug, format, is_current', [id]);
    if (!rows[0]) { await client.query('ROLLBACK'); return false; }
    if (rows[0].is_current) {
      await client.query(
        `UPDATE documents SET is_current = true WHERE id = (
           SELECT id FROM documents WHERE slug = $1 AND format = $2 ORDER BY version DESC LIMIT 1)`,
        [rows[0].slug, rows[0].format],
      );
    }
    await client.query('COMMIT');
    return true;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
