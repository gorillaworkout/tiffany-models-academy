CREATE TABLE IF NOT EXISTS ebook_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  module_count INTEGER NOT NULL DEFAULT 16,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ebook_modules (
  id TEXT PRIMARY KEY,
  package_id TEXT NOT NULL,
  session INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE member ADD COLUMN ebook_package_id TEXT;
