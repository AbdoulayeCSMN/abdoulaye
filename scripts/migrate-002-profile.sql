-- ============================================================
-- Migration 002 — profil modifiable en ligne + gestionnaire de CV
-- Idempotente : on peut la rejouer sans risque.
-- Usage : npx tsx scripts/run-sql.ts scripts/migrate-002-profile.sql
-- ============================================================

-- Textes libres du site (bilingues) : intro, disponibilité, etc.
CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value_fr   TEXT NOT NULL DEFAULT '',
  value_en   TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Expérience professionnelle et formation
CREATE TABLE IF NOT EXISTS experiences (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  kind           TEXT NOT NULL CHECK (kind IN ('work', 'education')),
  org            TEXT NOT NULL,
  role_fr        TEXT NOT NULL,
  role_en        TEXT NOT NULL DEFAULT '',
  period_fr      TEXT NOT NULL DEFAULT '',
  period_en      TEXT NOT NULL DEFAULT '',
  description_fr TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  sort_order     INTEGER NOT NULL DEFAULT 0,
  is_published   BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_experiences_kind_order ON experiences(kind, sort_order);

CREATE OR REPLACE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Domaines de compétences (sans pourcentages)
CREATE TABLE IF NOT EXISTS skills (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_fr      TEXT NOT NULL,
  name_en      TEXT NOT NULL DEFAULT '',
  detail_fr    TEXT NOT NULL DEFAULT '',
  detail_en    TEXT NOT NULL DEFAULT '',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(sort_order);

CREATE OR REPLACE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CV (PDF / DOCX) stockés en base, avec historique de versions.
-- Lien public stable : /cv/<slug>.<format>  (ex. /cv/ml-en.pdf)
CREATE TABLE IF NOT EXISTS documents (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug           TEXT NOT NULL CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,39}$'),
  format         TEXT NOT NULL CHECK (format IN ('pdf', 'docx')),
  label_fr       TEXT NOT NULL DEFAULT '',
  label_en       TEXT NOT NULL DEFAULT '',
  filename       TEXT NOT NULL,
  mime           TEXT NOT NULL,
  size_bytes     INTEGER NOT NULL,
  data           BYTEA NOT NULL,
  version        INTEGER NOT NULL DEFAULT 1,
  is_current     BOOLEAN NOT NULL DEFAULT true,
  is_public      BOOLEAN NOT NULL DEFAULT true,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
-- Une seule version « courante » par (slug, format)
CREATE UNIQUE INDEX IF NOT EXISTS uq_documents_current ON documents(slug, format) WHERE is_current;
CREATE INDEX IF NOT EXISTS idx_documents_slug ON documents(slug, format, version DESC);
