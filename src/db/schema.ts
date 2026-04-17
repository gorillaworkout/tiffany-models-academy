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
  id: text("id").primaryKey(), // using text (uuid/timestamp) for easier frontend generation
  studioId: text("studio_id").notNull(), // points to studio.id
  name: text("name").notNull(),
  status: text("status").notNull().default("Registration"),
  maxStudents: integer("max_students").notNull().default(30),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 3. Tabel Jadwal Latihan per Batch
export const jadwal = sqliteTable("jadwal", {
  id: text("id").primaryKey(),
  batchId: text("batch_id").notNull(),
  session: integer("session").notNull(),
  title: text("title").notNull(),
  date: text("date"),
  time: text("time"),
  studio: text("studio"),
  trainer: text("trainer"),
  outfit: text("outfit"),
  props: text("props"),
  isConfigured: integer("is_configured").notNull().default(0),
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
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  tanggalDaftar: text("tanggal_daftar").default(sql`CURRENT_TIMESTAMP`),
});

// 5. Tabel Studio/Location
export const studio = sqliteTable("studio", {
  id: text("id").primaryKey(), // Using text because current dummy uses string IDs like "Noble House, Jakarta"
  name: text("name").notNull(),
  lat: text("lat").notNull(), // SQLite can store as text and cast to number
  lon: text("lon").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 6. Tabel Coach
export const coach = sqliteTable("coach", {
  id: text("id").primaryKey(), // using the name as id for simplicity like dummy data
  name: text("name").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
