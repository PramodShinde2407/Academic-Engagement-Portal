-- ==========================================
-- CLUB REGISTRATION ENHANCEMENTS
-- Database Schema Updates
-- ==========================================

USE college_db;

-- ==========================================
-- 1. UPDATE CLUB_APPLICATION TABLE
-- Add missing fields for enhanced registration form
-- ==========================================

ALTER TABLE club_application
ADD COLUMN IF NOT EXISTS roll_no VARCHAR(50) AFTER college_email,
ADD COLUMN IF NOT EXISTS division VARCHAR(10) AFTER year,
ADD COLUMN IF NOT EXISTS phone_no VARCHAR(15) AFTER division;

-- ==========================================
-- 2. UPDATE CLUB TABLE
-- Add club_mentor_id to support dual management
-- ==========================================

-- Check if column exists before adding
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
               WHERE table_name = 'club' 
               AND column_name = 'club_mentor_id' 
               AND table_schema = DATABASE());

SET @sql := IF(@exist = 0, 
    'ALTER TABLE club ADD COLUMN club_mentor_id INT AFTER club_head_id, ADD CONSTRAINT fk_club_mentor FOREIGN KEY (club_mentor_id) REFERENCES user(user_id) ON DELETE SET NULL',
    'SELECT "Column club_mentor_id already exists"');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ==========================================
-- 3. VERIFICATION
-- ==========================================

SELECT 'Verifying club_application table...' AS '';
DESCRIBE club_application;

SELECT '' AS '';
SELECT 'Verifying club table...' AS '';
DESCRIBE club;

SELECT '' AS '';
SELECT 'Verifying club_interest table...' AS '';
DESCRIBE club_interest;

SELECT '' AS '';
SELECT '✅ Database schema updates complete!' AS 'Status';
