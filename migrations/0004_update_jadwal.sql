DROP TABLE IF EXISTS `jadwal`;
CREATE TABLE `jadwal` (
  `id` text PRIMARY KEY,
  `batch_id` text NOT NULL,
  `session` integer NOT NULL,
  `title` text NOT NULL,
  `date` text,
  `time` text,
  `studio` text,
  `trainer` text,
  `outfit` text,
  `props` text,
  `is_configured` integer NOT NULL DEFAULT 0,
  `created_at` text DEFAULT CURRENT_TIMESTAMP
);
