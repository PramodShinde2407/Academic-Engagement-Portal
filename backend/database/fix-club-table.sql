-- Fix the club table secret_key column size
USE college_db;

-- First, check if the column exists and its current size
SHOW COLUMNS FROM club LIKE 'secret_key';

-- Modify the column to be larger (VARCHAR(100))
ALTER TABLE club MODIFY COLUMN secret_key VARCHAR(100) UNIQUE;

-- Now insert the club with the secret key
INSERT IGNORE INTO club (name, description, secret_key) VALUES
('Tech Club', 'Technology and Innovation Club', 'TECH_CLUB_SECRET_2024');

-- Verify
SELECT club_id, name, secret_key FROM club;
