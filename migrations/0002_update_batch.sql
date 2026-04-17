DROP TABLE IF EXISTS `batch`;
CREATE TABLE `batch` (
  `id` text PRIMARY KEY,
  `studio_id` text NOT NULL,
  `name` text NOT NULL,
  `status` text NOT NULL DEFAULT 'Registration',
  `max_students` integer NOT NULL DEFAULT 30,
  `created_at` text DEFAULT CURRENT_TIMESTAMP
);
