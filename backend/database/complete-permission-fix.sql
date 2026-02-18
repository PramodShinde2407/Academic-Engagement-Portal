-- Complete Fix and Verification Script for Permission System
-- Run this entire script in MySQL Workbench

USE college_db;

-- =====================================================
-- STEP 1: Fix notification table - make title nullable
-- =====================================================
SELECT '=== STEP 1: Making title column nullable ===' AS '';

ALTER TABLE notification 
MODIFY COLUMN title VARCHAR(255) NULL;

SELECT '✓ Title column is now nullable' AS '';

-- =====================================================
-- STEP 2: Verify notification table structure
-- =====================================================
SELECT '=== STEP 2: Verifying notification table structure ===' AS '';

DESCRIBE notification;

-- =====================================================
-- STEP 3: Verify club table has club_mentor_id
-- =====================================================
SELECT '=== STEP 3: Checking club table ===' AS '';

DESCRIBE club;

-- =====================================================
-- STEP 4: Check if clubs have mentors assigned
-- =====================================================
SELECT '=== STEP 4: Clubs with mentors ===' AS '';

SELECT 
    c.club_id,
    c.name AS club_name,
    c.club_head_id,
    c.club_mentor_id,
    h.name AS head_name,
    m.name AS mentor_name
FROM club c
LEFT JOIN user h ON c.club_head_id = h.user_id
LEFT JOIN user m ON c.club_mentor_id = m.user_id;

-- =====================================================
-- STEP 5: Check permission_request table exists
-- =====================================================
SELECT '=== STEP 5: Permission request table ===' AS '';

DESCRIBE permission_request;

-- =====================================================
-- FINAL STATUS
-- =====================================================
SELECT '=== VERIFICATION COMPLETE ===' AS '';
SELECT 'If you see all tables above, the database is ready!' AS '';
SELECT 'Now try submitting a permission request.' AS '';
