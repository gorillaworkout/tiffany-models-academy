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
  coachId: text("coach_id").default(""), // points to coach.id
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
  description: text("description"), // New field for detailed curriculum
  date: text("date"),
  time: text("time"),
  startTime: text("start_time"),
  endTime: text("end_time"),
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
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  lat: text("lat").notNull(),
  lon: text("lon").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 6. Tabel Coach
export const coach = sqliteTable("coach", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 7. Tabel Absensi
export const absensi = sqliteTable("absensi", {
  id: text("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  jadwalId: text("jadwal_id").notNull(), // points to jadwal.id
  status: text("status").notNull(), // "hadir", "absen", "izin", "sakit"
  lat: text("lat"), // GPS Check-in
  lon: text("lon"), // GPS Check-in
  checkInTime: text("check_in_time").default(sql`CURRENT_TIMESTAMP`),
});

// 8. Tabel Transfer Requests
export const transferRequests = sqliteTable("transfer_requests", {
  id: text("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  fromBatchId: text("from_batch_id").notNull(),
  toBatchId: text("to_batch_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  reason: text("reason").default(""),
  moduleGap: integer("module_gap").default(0), // positive = behind, negative = ahead
  gapDetails: text("gap_details").default(""), // JSON string with details
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  resolvedAt: text("resolved_at"),
});
