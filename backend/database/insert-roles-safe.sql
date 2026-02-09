-- Safe insert that won't cause duplicate errors
USE college_db;

-- Method 1: Delete existing roles first (if you want to start fresh)
-- Uncomment these lines if you want to clear and re-insert:
-- DELETE FROM role;
-- ALTER TABLE role AUTO_INCREMENT = 1;

-- Method 2: Insert only if they don't exist (safer)
INSERT IGNORE INTO role (role_id, role_name) VALUES
(1, 'Student'),
(2, 'Faculty'),
(3, 'Admin'),
(4, 'Club Head');

-- Verify what's in the database
SELECT * FROM role ORDER BY role_id;
