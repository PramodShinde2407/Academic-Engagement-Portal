-- =====================================================
-- DATABASE UPDATES FOR CLUB REGISTRATION SYSTEM
-- Run this in MySQL shell to add missing fields/tables
-- =====================================================

USE college_db;

-- =====================================================
-- 1. UPDATE CLUB TABLE
-- Add missing fields for registration management
-- =====================================================

-- Check if columns exist, add if missing
ALTER TABLE club 
ADD COLUMN IF NOT EXISTS tagline VARCHAR(200),
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS activities TEXT;

-- Add registration control fields (rename is_registration_open to registration_open)
ALTER TABLE club 
ADD COLUMN IF NOT EXISTS registration_open BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS registration_deadline DATE NULL;

-- If you have is_registration_open, rename it
-- ALTER TABLE club CHANGE COLUMN is_registration_open registration_open BOOLEAN DEFAULT TRUE;

-- =====================================================
-- 2. UPDATE/CREATE CLUB_INTEREST TABLE
-- (You already have this, just verify structure)
-- =====================================================

-- Drop if exists with wrong structure, recreate
DROP TABLE IF EXISTS club_interest;

CREATE TABLE club_interest (
  interest_id INT PRIMARY KEY AUTO_INCREMENT,
  club_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notified BOOLEAN DEFAULT FALSE,  -- IMPORTANT: Add this field
  FOREIGN KEY (club_id) REFERENCES club(club_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  UNIQUE KEY unique_interest (club_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. RENAME/UPDATE CLUB_APPLICATION TO CLUB_REGISTRATIONS
-- Our code expects 'club_registrations' table
-- =====================================================

-- Drop old table if exists
DROP TABLE IF EXISTS club_application;

-- Create new table with correct structure
CREATE TABLE club_registrations (
  registration_id INT PRIMARY KEY AUTO_INCREMENT,
  club_id INT NOT NULL,
  user_id INT NULL,  -- NULL if user not logged in
  full_name VARCHAR(100) NOT NULL,
  personal_email VARCHAR(100) NOT NULL,
  college_email VARCHAR(100) NOT NULL,
  statement_of_purpose TEXT NOT NULL,
  profile_photo_url VARCHAR(255),  -- Path to uploaded JPG
  status VARCHAR(50) DEFAULT 'pending',  -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id) REFERENCES club(club_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE SET NULL,
  INDEX idx_club_id (club_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. UPDATE NOTIFICATION TABLE
-- Add missing fields for club registration system
-- =====================================================

-- Check current notification table structure
DESCRIBE notification;

-- Add missing columns if they don't exist
ALTER TABLE notification 
ADD COLUMN IF NOT EXISTS title VARCHAR(150),
ADD COLUMN IF NOT EXISTS link VARCHAR(255),
ADD COLUMN IF NOT EXISTS request_id INT NULL;

-- Update type column to allow more values
ALTER TABLE notification 
MODIFY COLUMN type VARCHAR(50) DEFAULT 'info';

-- =====================================================
-- 5. CREATE NOTIFICATIONS TABLE (separate from notification)
-- Our code uses 'notifications' (plural) for club system
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  notification_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',  -- info, success, warning, error
  link VARCHAR(255),  -- Optional link to relevant page
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  INDEX idx_user_read (user_id, is_read),
  INDEX idx_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. CREATE CLUB_MEMBER TABLE (if not exists)
-- For managing club members
-- =====================================================

CREATE TABLE IF NOT EXISTS club_member (
  id INT PRIMARY KEY AUTO_INCREMENT,
  club_id INT NOT NULL,
  student_id INT NULL,
  student_name VARCHAR(100),
  email VARCHAR(100),
  roll_no VARCHAR(50),
  year INT,
  branch VARCHAR(100),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id) REFERENCES club(club_id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES user(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

SELECT '=== CLUB TABLE STRUCTURE ===' AS '';
DESCRIBE club;

SELECT '=== CLUB_INTEREST TABLE ===' AS '';
DESCRIBE club_interest;

SELECT '=== CLUB_REGISTRATIONS TABLE ===' AS '';
DESCRIBE club_registrations;

SELECT '=== NOTIFICATION TABLE ===' AS '';
DESCRIBE notification;

SELECT '=== NOTIFICATIONS TABLE ===' AS '';
DESCRIBE notifications;

SELECT '=== CLUB_MEMBER TABLE ===' AS '';
DESCRIBE club_member;

SELECT 'Database updated successfully for Club Registration System!' AS Status;
