-- ============================================================
-- Portfolio PostgreSQL Schema — Full Version
-- ============================================================

-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────────────────
-- AUTO-UPDATED updated_at TRIGGER FUNCTION
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';


-- ──────────────────────────────────────────────────────────
-- PUBLIC TABLES (visible to all visitors)
-- ──────────────────────────────────────────────────────────

-- Projects showcased in the portfolio
CREATE TABLE IF NOT EXISTS projects (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  category      TEXT CHECK (category IN ('frontend','backend','fullstack','mobile','design','other')),
  technologies  TEXT[] DEFAULT '{}',
  github_url    TEXT,
  live_url      TEXT,
  cover_image   TEXT,
  is_featured   BOOLEAN DEFAULT false,
  is_published  BOOLEAN DEFAULT false,
  year          TEXT,
  status        TEXT CHECK (status IN ('live','completed','in_progress')) DEFAULT 'completed',
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_slug      ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_category  ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_order     ON projects(sort_order);

CREATE OR REPLACE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Contact messages sent by visitors
CREATE TABLE IF NOT EXISTS messages (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nom        TEXT NOT NULL,
  email      TEXT NOT NULL,
  tel        TEXT,
  objet      TEXT,
  content    TEXT,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_email    ON messages(email);
CREATE INDEX IF NOT EXISTS idx_messages_is_read  ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created  ON messages(created_at DESC);


-- ──────────────────────────────────────────────────────────
-- COURSES / NOTES (learning content)
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS courses (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  description  TEXT,
  category     TEXT,
  cover_image  TEXT,
  is_published BOOLEAN DEFAULT false,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Backfill for tables created before sort_order existed
ALTER TABLE courses ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_courses_slug      ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);

CREATE OR REPLACE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


CREATE TABLE IF NOT EXISTS notes (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id    UUID REFERENCES courses(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL,
  content      TEXT NOT NULL,
  order_index  INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE(course_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_notes_course_id  ON notes(course_id);
CREATE INDEX IF NOT EXISTS idx_notes_slug       ON notes(course_id, slug);
CREATE INDEX IF NOT EXISTS idx_notes_published  ON notes(is_published);
CREATE INDEX IF NOT EXISTS idx_notes_order      ON notes(course_id, order_index);

CREATE OR REPLACE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ──────────────────────────────────────────────────────────
-- ADMIN TABLES
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_active     BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email    ON admin_users(email);

CREATE OR REPLACE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


CREATE TABLE IF NOT EXISTS admin_sessions (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token      TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token   ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);


-- ──────────────────────────────────────────────────────────
-- HELPFUL VIEWS
-- ──────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW public_projects AS
  SELECT id, title, slug, description, category, technologies,
         github_url, live_url, cover_image, is_featured, year, status, sort_order
  FROM projects
  WHERE is_published = true
  ORDER BY sort_order ASC, created_at DESC;

CREATE OR REPLACE VIEW public_courses AS
  SELECT id, title, slug, description, category, cover_image, sort_order
  FROM courses
  WHERE is_published = true
  ORDER BY sort_order ASC, created_at DESC;

CREATE OR REPLACE VIEW unread_messages_count AS
  SELECT COUNT(*) AS count FROM messages WHERE is_read = false;
