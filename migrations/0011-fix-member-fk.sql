-- Remove FK constraint on batch_id and add new columns (alamat, ukuran_heels, ukuran_baju)
CREATE TABLE member_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id INTEGER,
  nama_lengkap TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  no_whatsapp TEXT NOT NULL,
  instagram TEXT,
  tinggi_badan INTEGER,
  berat_badan INTEGER,
  role TEXT NOT NULL DEFAULT 'class',
  status TEXT NOT NULL DEFAULT 'pending',
  tanggal_daftar TEXT DEFAULT CURRENT_TIMESTAMP,
  alamat TEXT,
  ukuran_heels TEXT,
  ukuran_baju TEXT
);

INSERT INTO member_new (id, batch_id, nama_lengkap, email, password, no_whatsapp, instagram, tinggi_badan, berat_badan, role, status, tanggal_daftar)
SELECT id, batch_id, nama_lengkap, email, password, no_whatsapp, instagram, tinggi_badan, berat_badan, role, status, tanggal_daftar FROM member;

DROP TABLE member;

ALTER TABLE member_new RENAME TO member;

CREATE UNIQUE INDEX idx_member_email ON member(email);
