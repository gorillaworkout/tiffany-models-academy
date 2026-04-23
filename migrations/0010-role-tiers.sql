-- Migration: Role Tiers
-- Transition from 2-role (student/admin) to 4-role (admin/ebook/class/private) system
-- The role column already exists as TEXT, no schema change needed — just new values

-- Clean up all non-admin members (fresh start for the new role system)
DELETE FROM member WHERE role != 'admin';

-- Clean up related data
DELETE FROM absensi;
DELETE FROM transfer_requests WHERE 1=1;
