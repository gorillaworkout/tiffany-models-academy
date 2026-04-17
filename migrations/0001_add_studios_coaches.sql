CREATE TABLE IF NOT EXISTS `studio` (
  `id` text PRIMARY KEY,
  `name` text NOT NULL,
  `lat` text NOT NULL,
  `lon` text NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `coach` (
  `id` text PRIMARY KEY,
  `name` text NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP
);

-- Insert Dummy Data for studios
INSERT INTO `studio` (`id`, `name`, `lat`, `lon`) VALUES 
('Noble House, Jakarta', 'Noble House, Jakarta', '-6.2280239', '106.825536'),
('Studio A, Jakarta', 'Studio A, Jakarta', '-6.230000', '106.820000'),
('Photo Studio B, Bandung', 'Photo Studio B, Bandung', '-6.9164893', '107.624465'),
('Main Hall, Bandung', 'Main Hall, Bandung', '-6.915000', '107.620000');

-- Insert Dummy Data for coaches
INSERT INTO `coach` (`id`, `name`) VALUES 
('Nadira Tiffanny', 'Nadira Tiffanny'),
('Coach Sarah', 'Coach Sarah'),
('Coach Michael', 'Coach Michael'),
('Coach Dina', 'Coach Dina'),
('Coach Budi', 'Coach Budi'),
('Coach Lisa', 'Coach Lisa'),
('Guest Photographer', 'Guest Photographer'),
('All Coaches', 'All Coaches');
