CREATE TABLE IF NOT EXISTS transfer_requests (
  id TEXT PRIMARY KEY,
  member_id INTEGER NOT NULL,
  from_batch_id TEXT NOT NULL,
  to_batch_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reason TEXT DEFAULT '',
  module_gap INTEGER DEFAULT 0,
  gap_details TEXT DEFAULT '',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT
);
