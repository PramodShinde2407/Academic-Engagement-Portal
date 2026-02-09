-- Insert roles into the database
USE college_db;

-- Clear existing roles (optional - remove if you want to keep existing data)
-- DELETE FROM role;

-- Insert all required roles
INSERT INTO role (role_id, role_name) VALUES
(1, 'Student'),
(2, 'Faculty'),
(3, 'Admin'),
(4, 'Club Head')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

-- Verify roles were inserted
SELECT * FROM role ORDER BY role_id;
