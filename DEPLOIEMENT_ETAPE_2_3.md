# Étapes 2 + 3 — base de données, admin, CV en ligne

Sur ta base PostgreSQL de production (variables POSTGRES_* déjà configurées) :

    npm install --legacy-peer-deps
    npm run db:migrate:profile   # crée site_settings, experiences, skills, documents + contenu initial
    npm run db:import-cvs        # met en ligne les 20 CV (cv_seed/) ; relançable, n'écrase rien

Ensuite, connecté à /admin :
- /admin/profile   : textes de présentation, expérience/formation, compétences (FR + EN)
- /admin/documents : téléverser une nouvelle version d'un CV (le lien /cv/<profil>-<fr|en>.<pdf|docx> reste identique ; anciennes versions restaurables)

Si la migration n'est pas appliquée, la page « À propos » affiche un contenu de secours (pas d'erreur).
Aucun .env n'est inclus : garde le tien.
