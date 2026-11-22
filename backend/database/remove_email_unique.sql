-- Run this script if your MySQL database was already created with the unique constraint
USE medicare_db;

-- 1. Drop UNIQUE constraint/index from email column in users table
ALTER TABLE users DROP INDEX email;

-- Verify table structure
DESCRIBE users;
