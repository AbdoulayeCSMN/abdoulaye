# Portfolio Abdoulaye

Portfolio personnel développé avec Next.js 16, TypeScript, Tailwind CSS, et PostgreSQL.

## Fonctionnalités

- 🌍 **i18n FR/EN** — next-intl, switcher dans le header
- 🗄️ **Base de données PostgreSQL** — projets, messages, cours, notes
- 🔒 **Panel Admin** — accès `/admin`, auth par mot de passe bcrypt
- 🎨 **Dark/Light mode** — next-themes
- 📱 **Responsive** — mobile-first

## Installation

```bash
# 1. Cloner & installer
npm install

# 2. Créer le fichier .env
cp .env.example .env
# Remplir les variables PostgreSQL

# 3. Initialiser la base de données
psql -U <user> -d <database> -f app/schema.sql

# 4. Créer le premier utilisateur admin
ADMIN_USERNAME=admin ADMIN_EMAIL=you@email.com ADMIN_PASSWORD=votremdp npm run create-admin

# 5. Lancer le serveur
npm run dev
```

## Structure

```
app/
├── [locale]/          # Pages publiques (FR/EN via next-intl)
├── admin/             # Panel admin (protégé par cookie de session)
├── api/               # API Routes Next.js
│   ├── projects/      # GET projets publiés
│   └── admin/         # CRUD admin (auth requise)
├── schema.sql         # Schéma PostgreSQL complet
└── src/
    ├── components/    # Composants React
    └── lib/
        ├── pg-client.ts   # Client PostgreSQL + toutes les fonctions DB
        └── i18n/          # Config next-intl

messages/
├── fr.json            # Traductions françaises
└── en.json            # Traductions anglaises

scripts/
└── create-admin.ts    # Script de création du premier admin
```

## Admin Panel

URL : `/admin/login`

| Section    | URL                   |
|------------|-----------------------|
| Projets    | `/admin/projects`     |
| Cours      | `/admin/courses`      |
| Messages   | `/admin/messages`     |

## Base de données — Tables

| Table           | Accès    | Description                        |
|-----------------|----------|------------------------------------|
| `projects`      | Public   | Projets du portfolio               |
| `messages`      | Admin    | Messages du formulaire contact     |
| `courses`       | Public   | Cours / formations                 |
| `notes`         | Public   | Leçons d'un cours (MDX)            |
| `admin_users`   | Admin    | Comptes administrateurs            |
| `admin_sessions`| Admin    | Sessions actives (tokens)          |
