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
// Valid roles: 'admin' | 'ebook' | 'class' | 'private'
//   - admin: Director, full admin panel access
//   - ebook: E-Book Member, curriculum/modules page only, no batch/branch needed
//   - class: Class Member, full access (modules, jadwal, attendance, transfer), requires batch/branch
//   - private: Private Class, curriculum/modules page only, no batch/branch needed
export const member = sqliteTable("member", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  batchId: integer("batch_id"), // nullable, no FK constraint — null for ebook/private
  namaLengkap: text("nama_lengkap").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Akan kita hash (acak) nanti biar aman
  noWhatsApp: text("no_whatsapp").notNull(),
  instagram: text("instagram"),
  tinggiBadan: integer("tinggi_badan"), 
  beratBadan: integer("berat_badan"), 
  role: text("role").notNull().default("class"), // admin, ebook, class, private
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  tanggalDaftar: text("tanggal_daftar").default(sql`CURRENT_TIMESTAMP`),
  alamat: text("alamat"), // address
  ukuranHeels: text("ukuran_heels"), // heels size
  ukuranBaju: text("ukuran_baju"), // clothes/outfit size
  ebookPackageId: text("ebook_package_id"), // links ebook/private users to their package
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

// 9. E-Book Packages
export const ebookPackages = sqliteTable("ebook_packages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  moduleCount: integer("module_count").notNull().default(16),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 10. E-Book Modules
export const ebookModules = sqliteTable("ebook_modules", {
  id: text("id").primaryKey(),
  packageId: text("package_id").notNull(),
  session: integer("session").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 11. WhatsApp Groups (for Fonnte reminders)
export const waGroups = sqliteTable("wa_groups", {
  id: text("id").primaryKey(), // UUID
  name: text("name").notNull(), // Display name, e.g. "TMA Batch 1 Jakarta"
  groupId: text("group_id").notNull(), // WA group ID, e.g. "120363407748334471@g.us"
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
