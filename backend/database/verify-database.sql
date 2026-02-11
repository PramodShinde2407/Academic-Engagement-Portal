-- =====================================================
-- DATABASE VERIFICATION SCRIPT
-- Run this to check if all required tables and columns exist
-- =====================================================

USE college_db;

SELECT '========================================' AS '';
SELECT 'VERIFYING DATABASE SCHEMA' AS '';
SELECT '========================================' AS '';

-- =====================================================
-- 1. CHECK CLUB TABLE
-- =====================================================
SELECT '1. CLUB TABLE' AS '';
SELECT 'Required columns: name, description, club_head_id, secret_key, tagline, category, activities, registration_open, registration_deadline' AS '';

SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'college_db' 
  AND TABLE_NAME = 'club'
ORDER BY ORDINAL_POSITION;

-- =====================================================
-- 2. CHECK CLUB_INTEREST TABLE
-- =====================================================
SELECT '2. CLUB_INTEREST TABLE' AS '';
SELECT 'Required columns: interest_id, club_id, user_id, created_at, notified' AS '';

SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'college_db' 
  AND TABLE_NAME = 'club_interest'
ORDER BY ORDINAL_POSITION;

-- =====================================================
-- 3. CHECK CLUB_REGISTRATIONS TABLE
-- =====================================================
SELECT '3. CLUB_REGISTRATIONS TABLE' AS '';
SELECT 'Required columns: registration_id, club_id, user_id, full_name, personal_email, college_email, statement_of_purpose, profile_photo_url, status, created_at' AS '';

SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'college_db' 
  AND TABLE_NAME = 'club_registrations'
ORDER BY ORDINAL_POSITION;

-- =====================================================
-- 4. CHECK NOTIFICATION TABLE (legacy)
-- =====================================================
SELECT '4. NOTIFICATION TABLE (for permission system)' AS '';
SELECT 'Required columns: notification_id, user_id, message, is_read, type, created_at, title, link, request_id' AS '';

SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'college_db' 
  AND TABLE_NAME = 'notification'
ORDER BY ORDINAL_POSITION;

-- =====================================================
-- 5. CHECK NOTIFICATIONS TABLE (club system)
-- =====================================================
SELECT '5. NOTIFICATIONS TABLE (for club registration system)' AS '';
SELECT 'Required columns: notification_id, user_id, title, message, type, link, is_read, created_at' AS '';

SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'college_db' 
  AND TABLE_NAME = 'notifications'
ORDER BY ORDINAL_POSITION;

-- =====================================================
-- 6. CHECK CLUB_MEMBER TABLE
-- =====================================================
SELECT '6. CLUB_MEMBER TABLE' AS '';
SELECT 'Required columns: id, club_id, student_id, student_name, email, roll_no, year, branch, joined_at' AS '';

SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'college_db' 
  AND TABLE_NAME = 'club_member'
ORDER BY ORDINAL_POSITION;

-- =====================================================
-- 7. LIST ALL TABLES
-- =====================================================
SELECT '7. ALL TABLES IN DATABASE' AS '';
SHOW TABLES;

-- =====================================================
-- 8. SUMMARY CHECK
-- =====================================================
SELECT '========================================' AS '';
SELECT 'SUMMARY CHECK' AS '';
SELECT '========================================' AS '';

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'college_db' AND TABLE_NAME = 'club') 
    THEN '✓ club table exists'
    ELSE '✗ club table MISSING'
  END AS 'Table Check';

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'college_db' AND TABLE_NAME = 'club' AND COLUMN_NAME = 'registration_open') 
    THEN '✓ club.registration_open exists'
    ELSE '✗ club.registration_open MISSING'
  END AS 'Column Check';

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'college_db' AND TABLE_NAME = 'club_interest') 
    THEN '✓ club_interest table exists'
    ELSE '✗ club_interest table MISSING'
  END AS 'Table Check';

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'college_db' AND TABLE_NAME = 'club_interest' AND COLUMN_NAME = 'notified') 
    THEN '✓ club_interest.notified exists'
    ELSE '✗ club_interest.notified MISSING'
  END AS 'Column Check';

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'college_db' AND TABLE_NAME = 'club_registrations') 
    THEN '✓ club_registrations table exists'
    ELSE '✗ club_registrations table MISSING'
  END AS 'Table Check';

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'college_db' AND TABLE_NAME = 'notifications') 
    THEN '✓ notifications table exists'
    ELSE '✗ notifications table MISSING'
  END AS 'Table Check';

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'college_db' AND TABLE_NAME = 'club_member') 
    THEN '✓ club_member table exists'
    ELSE '✗ club_member table MISSING'
  END AS 'Table Check';

SELECT '========================================' AS '';
SELECT 'VERIFICATION COMPLETE!' AS '';
SELECT '========================================' AS '';
