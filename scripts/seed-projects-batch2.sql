-- ============================================================
-- Seed: additional projects pulled from https://github.com/AbdoulayeCSMN
-- (batch 2 — repos missed in the first pass due to API list truncation)
-- Idempotent — safe to re-run on every deploy (ON CONFLICT on slug).
-- Run after scripts/seed-projects.sql.
-- ============================================================

-- avien's homepage was missed in batch 1
UPDATE projects SET live_url = 'https://avien.tech', updated_at = CURRENT_TIMESTAMP
  WHERE slug = 'avien' AND live_url IS NULL;

INSERT INTO projects
  (title, slug, description, category, technologies, github_url, live_url,
   is_featured, is_published, year, status, sort_order)
VALUES
(
  'Supplier Risk Management Platform',
  'supplier-risk',
  'Plateforme SaaS multi-tenant qui automatise l''evaluation, le suivi et la mitigation des risques fournisseurs dans les chaines d''approvisionnement : centralisation des donnees fournisseurs, tableaux de bord d''analyse de risques et alertes proactives de conformite.',
  'fullstack',
  ARRAY['Next.js 14','TypeScript','Supabase','PostgreSQL'],
  'https://github.com/AbdoulayeCSMN/supplier-risk',
  NULL,
  false, true, '2026', 'in_progress', 7
),
(
  'SkiFlow — Structure Pieces',
  'skiflow-structure-pieces',
  'Bibliotheque C++ fournissant trois composants bas niveau pour l''ecosysteme SkiFlow : un graphe memoire neuro-symbolique (NSMG), un treillis d''execution adaptatif (AEL) et un champ semantique quantique (QSF).',
  'other',
  ARRAY['C++17','CMake'],
  'https://github.com/AbdoulayeCSMN/SkiFlowStructurePieces',
  NULL,
  false, true, '2026', 'in_progress', 8
),
(
  'Hausa Tokenizer',
  'hausa-tokenizer',
  'Tokenizer hybride pour la langue haoussa combinant analyse morphologique par regles et encodage par paires d''octets (BPE), sans dependance lourde type SentencePiece ou HuggingFace Tokenizers.',
  'backend',
  ARRAY['Python','BPE','Unicode/NFC'],
  'https://github.com/AbdoulayeCSMN/hausa-tokenizer',
  NULL,
  false, true, '2026', 'completed', 9
),
(
  'Movie Recommender',
  'movie-recommender',
  'Systeme de recommandation de films combinant sept algorithmes (SVD optimise, SVD++, Neural Collaborative Filtering, Factorization Machines, recommandations contextuelles, methodes d''ensemble) expose via une API REST et une interface Streamlit, entraine sur les jeux de donnees MovieLens.',
  'fullstack',
  ARRAY['Python','Flask','FastAPI','Streamlit','TensorFlow','Scikit-learn'],
  'https://github.com/AbdoulayeCSMN/Movie-Recommender',
  NULL,
  false, true, '2026', 'completed', 10
),
(
  'Portefeuille Advisor',
  'portefeuille-advisor',
  'Agent d''apprentissage par renforcement (SAC) qui optimise l''allocation d''actifs financiers selon le profil de risque de l''investisseur (conservateur, equilibre, agressif) sur un horizon de 10 ans, avec une application Streamlit pour simuler et visualiser les strategies.',
  'fullstack',
  ARRAY['Python','Stable-Baselines3','Gymnasium','Streamlit','Pandas'],
  'https://github.com/AbdoulayeCSMN/Portefeuille-Advisor',
  NULL,
  false, true, '2026', 'completed', 11
),
(
  'TkLearn Studio',
  'tklearn-studio',
  'Application pedagogique de bureau (Tkinter) offrant un bac a sable pour apprendre l''interface graphique Python : editeur avec coloration syntaxique, previsualisation en temps reel, console integree et lecons structurees.',
  'other',
  ARRAY['Python','Tkinter'],
  'https://github.com/AbdoulayeCSMN/tklearn-studio',
  NULL,
  false, true, '2026', 'completed', 12
),
(
  'TkImage Studio',
  'tkimage-studio',
  'Application de bureau pour la gestion et l''annotation d''images destinees a des projets de Machine Learning, avec transformation d''images, annotation par metadonnees et analyse automatisee via l''API Gemini.',
  'other',
  ARRAY['Python','Tkinter','OpenCV','Gemini API'],
  'https://github.com/AbdoulayeCSMN/tkimage-studio',
  NULL,
  false, true, '2026', 'completed', 13
),
(
  'Gestion de Stock',
  'gestion-de-stock',
  'Application de gestion d''inventaire pour entreprises : authentification par roles, operations CRUD sur les produits, recherche avancee et indicateurs de stock en temps reel.',
  'fullstack',
  ARRAY['Django','Python','Bootstrap'],
  'https://github.com/AbdoulayeCSMN/Gestion-de-stock',
  NULL,
  false, true, '2026', 'completed', 14
),
(
  'Pappagallo',
  'pappagallo',
  'Interface Streamlit permettant aux employes d''interagir avec un chatbot Botpress sans acces a la configuration interne : assistant de motivation et de productivite en milieu professionnel, avec rendu type application mobile.',
  'frontend',
  ARRAY['Python','Streamlit','Botpress'],
  'https://github.com/AbdoulayeCSMN/pappagallo',
  NULL,
  false, true, '2026', 'completed', 15
),
(
  'Plateforme Pedagogique Java',
  'plateforme-pedagogique-java',
  'Plateforme web pedagogique pour l''apprentissage du langage Java.',
  'fullstack',
  ARRAY['Java','HTML'],
  'https://github.com/AbdoulayeCSMN/Plateforme-P%C3%A9dagogique-Java',
  NULL,
  false, true, '2026', 'completed', 16
),
(
  'PPNet — Prototypical Part Networks',
  'ppnet-12-25',
  'Travail de recherche en apprentissage profond interpretable, implementant les Prototypical Part Networks ("this looks like that") : extraction de caracteristiques (DenseNet, ResNet, VGG), apprentissage et elagage de prototypes pour expliquer les decisions de classification d''images.',
  'other',
  ARRAY['Python','Jupyter Notebook','PyTorch'],
  'https://github.com/AbdoulayeCSMN/PPNet_12-25',
  NULL,
  false, true, '2026', 'completed', 17
)
ON CONFLICT (slug) DO UPDATE SET
  title        = EXCLUDED.title,
  description  = EXCLUDED.description,
  category     = EXCLUDED.category,
  technologies = EXCLUDED.technologies,
  github_url   = EXCLUDED.github_url,
  live_url      = EXCLUDED.live_url,
  is_featured  = EXCLUDED.is_featured,
  is_published = EXCLUDED.is_published,
  year         = EXCLUDED.year,
  status       = EXCLUDED.status,
  sort_order   = EXCLUDED.sort_order,
  updated_at   = CURRENT_TIMESTAMP;
