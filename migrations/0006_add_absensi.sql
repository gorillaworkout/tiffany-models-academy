CREATE TABLE IF NOT EXISTS `absensi` (
  `id` text PRIMARY KEY,
  `member_id` integer NOT NULL,
  `jadwal_id` text NOT NULL,
  `status` text NOT NULL,
  `lat` text,
  `lon` text,
  `check_in_time` text DEFAULT CURRENT_TIMESTAMP
);
