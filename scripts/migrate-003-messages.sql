-- Suivi de l'envoi d'email pour les messages de contact
ALTER TABLE messages ADD COLUMN IF NOT EXISTS email_status TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS locale TEXT;
