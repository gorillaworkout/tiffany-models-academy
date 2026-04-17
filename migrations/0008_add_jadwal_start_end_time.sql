ALTER TABLE jadwal ADD COLUMN start_time TEXT DEFAULT '';
ALTER TABLE jadwal ADD COLUMN end_time TEXT DEFAULT '';
-- Migrate existing 'time' column data ('HH:mm - HH:mm') to separate fields
