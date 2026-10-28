-- ============================================================
-- Seed: projects pulled from https://github.com/AbdoulayeCSMN
-- Idempotent — safe to re-run on every deploy (ON CONFLICT on slug).
-- Run after app/schema.sql has been applied.
-- ============================================================

-- VendorShield was renamed to Avilyre — migrate the slug on existing rows
-- so the INSERT ... ON CONFLICT below updates it in place instead of
-- leaving a stale 'vendorshield' row behind.
UPDATE projects SET slug = 'avilyre', title = 'Avilyre', updated_at = CURRENT_TIMESTAMP
  WHERE slug = 'vendorshield';

INSERT INTO projects
  (title, slug, description, category, technologies, github_url, live_url,
   is_featured, is_published, year, status, sort_order)
VALUES
(
  'Avilyre',
  'avilyre',
  'Plateforme SaaS B2B qui aide les directions achats et supply chain a noter, surveiller et anticiper les risques de leur portefeuille fournisseurs : sante financiere, performance operationnelle, risques geopolitiques, ESG, cyber et climatiques, avec notation ponderee sur 24 criteres, predictions ML (defaillance, retards de livraison) et une IA agentique. Positionnee sur le segment mid-market industriel francophone/ouest-africain, avec support i18n hausa.',
  'fullstack',
  ARRAY['Next.js 15','React 19','TailwindCSS','Supabase','PostgreSQL','FastAPI','Python','MLflow','Groq','Claude','Turborepo'],
  'https://github.com/AbdoulayeCSMN/vendorshield',
  NULL,
  true, true, '2026', 'in_progress', 1
),
(
  'AVIEN',
  'avien',
  'Plateforme SaaS de maintenance predictive industrielle : import de donnees capteurs, visualisation de series temporelles, detection d''anomalies par IA (Isolation Forest) et alertes sur seuils critiques, avec interface sombre adaptee aux environnements industriels.',
  'fullstack',
  ARRAY['Next.js 14','TypeScript','TailwindCSS','FastAPI','Python','PostgreSQL','TimescaleDB','Redis','Celery','Scikit-learn'],
  'https://github.com/AbdoulayeCSMN/avien',
  NULL,
  true, true, '2026', 'in_progress', 2
),
(
  'Multi-Agent Security Scanner',
  'mas-ensam-2026',
  'Plateforme d''analyse de code orchestree par 8 agents IA specialises pour identifier les vulnerabilites de securite et generer automatiquement des correctifs valides : analyse statique multi-outils, inspection semantique par LLM et moteur memoire pour reviser et reparer du code en production.',
  'backend',
  ARRAY['Python','FastAPI','LangGraph','Llama 3.1','Semgrep','Bandit','Rust','Qdrant'],
  'https://github.com/AbdoulayeCSMN/MAS-ENSAM-2026',
  NULL,
  true, true, '2026', 'completed', 3
),
(
  'Harzourou & Aiki',
  'harzourou-aiki',
  'Langage de programmation Harzourou (donnees immuables, programmation fonctionnelle, operateur pipe) avec Aiki, son gestionnaire de paquets officiel ecrit en Rust, et HarzMind, sa suite de modules d''IA embarquee.',
  'other',
  ARRAY['C++17','Rust','CMake','TOML'],
  'https://github.com/AbdoulayeCSMN/aiki',
  'https://github.com/AbdoulayeCSMN/harzourou-documentation',
  false, true, '2026', 'in_progress', 4
),
(
  'Mechora',
  'mechora',
  'Application full-stack en cours de developpement, structuree en backend Python et frontend TypeScript.',
  'fullstack',
  ARRAY['Python','TypeScript'],
  'https://github.com/AbdoulayeCSMN/Mechora',
  NULL,
  false, true, '2026', 'in_progress', 5
),
(
  'CoranHifz',
  'coranhifz',
  'Application Android d''aide a la memorisation du Coran (Hifz), developpee en Kotlin.',
  'mobile',
  ARRAY['Kotlin','Android','Gradle'],
  'https://github.com/AbdoulayeCSMN/CoranHifz',
  NULL,
  false, true, '2026', 'in_progress', 6
)
ON CONFLICT (slug) DO UPDATE SET
  title        = EXCLUDED.title,
  description  = EXCLUDED.description,
  category     = EXCLUDED.category,
  technologies = EXCLUDED.technologies,
  github_url   = EXCLUDED.github_url,
  live_url     = EXCLUDED.live_url,
  is_featured  = EXCLUDED.is_featured,
  is_published = EXCLUDED.is_published,
  year         = EXCLUDED.year,
  status       = EXCLUDED.status,
  sort_order   = EXCLUDED.sort_order,
  updated_at   = CURRENT_TIMESTAMP;
