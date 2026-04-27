CREATE TABLE `wa_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`group_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
