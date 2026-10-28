-- ============================================================
-- Seed du profil (faits vérifiés : attestations Technocolabs et DigiScia).
-- Ne remplit que les tables vides : rejouable sans écraser tes modifications.
-- Usage : npx tsx scripts/run-sql.ts scripts/seed-profile.sql
-- ============================================================

INSERT INTO site_settings (key, value_fr, value_en) VALUES
 ('about_intro_1',
  'Élève-ingénieur en 5ᵉ année à l’ENSAM Meknès (Université Moulay Ismaïl), filière Intelligence Artificielle et Technologies de Données — Sciences de l’Ingénieur (IATD-SI).',
  'Fifth-year engineering student at ENSAM Meknès (Moulay Ismaïl University), in the Artificial Intelligence and Data Technologies track (IATD-SI).'),
 ('about_intro_2',
  'Je conçois et développe des projets concrets, du machine learning et de l’analyse de données aux systèmes bas niveau (un langage de programmation et son gestionnaire de paquets), en passant par les plateformes SaaS et la réalité augmentée. Je cherche un stage de fin d’études en IA / machine learning à partir de février 2027.',
  'I design and build hands-on projects, from machine learning and data analysis to low-level systems (a programming language and its package manager), including SaaS platforms and augmented reality. I am looking for a final-year internship in AI / machine learning from February 2027.'),
 ('learning_line',
  'Apprentissage rapide et continu : Julia, Rust, Unity / AR, apprentissage par renforcement et MLOps appris au fil de mes projets.',
  'Fast, continuous learner: Julia, Rust, Unity / AR, reinforcement learning and MLOps picked up through my projects.')
ON CONFLICT (key) DO NOTHING;

INSERT INTO experiences (kind, org, role_fr, role_en, period_fr, period_en, description_fr, description_en, sort_order)
SELECT * FROM (VALUES
 ('work', 'DigiScia — Ouagadougou (Burkina Faso)',
  'Stagiaire développeur full stack', 'Full-Stack Developer Intern',
  '6 juillet – 6 septembre 2026', 'July 6 – September 6, 2026',
  'Projet SimpleOQuotidien : application qui met en relation de petits prestataires (par exemple un plombier) et des clients — recherche de prestataires, envoi de devis, assignation. Ma part : le front-end, en Next.js.',
  'SimpleOQuotidien project: an application connecting small-trade service providers (for example a plumber) with clients — provider search, quotes, assignment. My part: the front-end, in Next.js.',
  10),
 ('work', 'Technocolabs Softwares — Indore (Inde), à distance',
  'Stagiaire Data Scientist', 'Data Scientist Intern',
  '1er août – 20 octobre 2025 (2 mois)', 'August 1 – October 20, 2025 (2 months)',
  'Projet d’équipe « Startup Acquisition Analysis & ML Pipeline » : prédire le devenir de startups (acquisition, fermeture, IPO, activité continue). Ma part : arbres de décision et SVM sur le jeu de données « companies ».',
  'Team project “Startup Acquisition Analysis & ML Pipeline”: predicting startup outcomes (acquisition, closure, IPO, continued operation). My part: decision trees and SVM on the “companies” dataset.',
  20),
 ('education', 'ENSAM Meknès — Université Moulay Ismaïl',
  'Cycle ingénieur — filière IATD-SI', 'Engineering degree — IATD-SI track',
  '2022 – 2027 (diplôme prévu en 2027)', '2022 – 2027 (degree expected 2027)',
  'Intelligence Artificielle et Technologies de Données — Sciences de l’Ingénieur. Cinquième année en cours.',
  'Artificial Intelligence and Data Technologies — Engineering Sciences. Currently in fifth year.',
  10)
) AS v(kind, org, role_fr, role_en, period_fr, period_en, description_fr, description_en, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM experiences);

INSERT INTO skills (name_fr, name_en, detail_fr, detail_en, sort_order)
SELECT * FROM (VALUES
 ('Machine Learning / IA', 'Machine Learning / AI',
  'LightGBM, Isolation Forest, SVM, recommandation (SVD, NCF), apprentissage par renforcement (SAC), CamemBERT (classification d’intentions)',
  'LightGBM, Isolation Forest, SVM, recommendation (SVD, NCF), reinforcement learning (SAC), CamemBERT (intent classification)', 10),
 ('Systèmes bas niveau', 'Low-level systems',
  'Rust (gestionnaire de paquets Aiki), C++17 (bibliothèque SFlowMind), Julia',
  'Rust (Aiki package manager), C++17 (SFlowMind library), Julia', 20),
 ('Développement full-stack', 'Full-stack development',
  'Next.js, React, TypeScript, FastAPI, PostgreSQL, Supabase',
  'Next.js, React, TypeScript, FastAPI, PostgreSQL, Supabase', 30),
 ('MLOps & déploiement', 'MLOps & deployment',
  'Docker / Compose, DVC, Celery, Redis, détection de dérive (PSI), pytest',
  'Docker / Compose, DVC, Celery, Redis, drift detection (PSI), pytest', 40)
) AS v(name_fr, name_en, detail_fr, detail_en, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM skills);
