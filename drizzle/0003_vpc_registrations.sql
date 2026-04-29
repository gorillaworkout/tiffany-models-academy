-- VPC (VATA Parkour Challenge) Registrations table
CREATE TABLE IF NOT EXISTS `vpc_registrations` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `club_name` text NOT NULL,
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `phone` text NOT NULL,
  `email` text NOT NULL,
  `skill_7_8` text NOT NULL DEFAULT '{"male":0,"female":0}',
  `speed_8_9` text NOT NULL DEFAULT '{"male":0,"female":0}',
  `speed_10_12` text NOT NULL DEFAULT '{"male":0,"female":0}',
  `speed_13_15` text NOT NULL DEFAULT '{"male":0,"female":0}',
  `free_10_12` text NOT NULL DEFAULT '{"male":0,"female":0}',
  `free_13_15` text NOT NULL DEFAULT '{"male":0,"female":0}',
  `free_16_open` text NOT NULL DEFAULT '{"male":0,"female":0}',
  `total_participants` integer NOT NULL DEFAULT 0,
  `notes` text,
  `status` text NOT NULL DEFAULT 'pending',
  `created_at` text DEFAULT CURRENT_TIMESTAMP
);
