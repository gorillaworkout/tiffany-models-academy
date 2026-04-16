import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// 1. Tabel Cabang
export const cabang = sqliteTable("cabang", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nama: text("nama").notNull(),
  lokasiDetail: text("lokasi_detail"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 2. Tabel Batch (Periode)
export const batch = sqliteTable("batch", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cabangId: integer("cabang_id").references(() => cabang.id).notNull(),
  nama: text("nama").notNull(), // cth: "Batch 1 - 2026"
  status: text("status").notNull().default("aktif"), // aktif, selesai, pendaftaran
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 3. Tabel Jadwal Latihan per Batch
export const jadwal = sqliteTable("jadwal", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  batchId: integer("batch_id").references(() => batch.id).notNull(),
  hari: text("hari").notNull(), // cth: "Minggu"
  jamMulai: text("jam_mulai").notNull(), // cth: "10:00"
  jamSelesai: text("jam_selesai").notNull(), // cth: "12:00"
  materi: text("materi").default("Basic Modeling"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 4. Tabel Member / Murid (Ditambah Email & Password buat Login!)
export const member = sqliteTable("member", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  batchId: integer("batch_id").references(() => batch.id).notNull(),
  namaLengkap: text("nama_lengkap").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Akan kita hash (acak) nanti biar aman
  noWhatsApp: text("no_whatsapp").notNull(),
  instagram: text("instagram"),
  tinggiBadan: integer("tinggi_badan"), 
  beratBadan: integer("berat_badan"), 
  role: text("role").notNull().default("student"), // student atau admin
  tanggalDaftar: text("tanggal_daftar").default(sql`CURRENT_TIMESTAMP`),
});
