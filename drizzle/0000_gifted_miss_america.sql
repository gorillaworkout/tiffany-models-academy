CREATE TABLE `batch` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cabang_id` integer NOT NULL,
	`nama` text NOT NULL,
	`status` text DEFAULT 'aktif' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`cabang_id`) REFERENCES `cabang`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cabang` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nama` text NOT NULL,
	`lokasi_detail` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `jadwal` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`batch_id` integer NOT NULL,
	`hari` text NOT NULL,
	`jam_mulai` text NOT NULL,
	`jam_selesai` text NOT NULL,
	`materi` text DEFAULT 'Basic Modeling',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`batch_id`) REFERENCES `batch`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `member` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`batch_id` integer NOT NULL,
	`nama_lengkap` text NOT NULL,
	`no_whatsapp` text NOT NULL,
	`instagram` text,
	`tinggi_badan` integer,
	`berat_badan` integer,
	`tanggal_daftar` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`batch_id`) REFERENCES `batch`(`id`) ON UPDATE no action ON DELETE no action
);
