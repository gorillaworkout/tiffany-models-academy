ALTER TABLE `member` ADD `email` text NOT NULL;--> statement-breakpoint
ALTER TABLE `member` ADD `password` text NOT NULL;--> statement-breakpoint
ALTER TABLE `member` ADD `role` text DEFAULT 'student' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `member_email_unique` ON `member` (`email`);