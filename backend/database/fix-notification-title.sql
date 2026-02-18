-- Fix notification table to make title column nullable
-- This allows the permission system to work without providing a title
USE college_db;

-- Check current notification table structure
DESCRIBE notification;

-- Make title column nullable (allow NULL values)
ALTER TABLE notification 
MODIFY COLUMN title VARCHAR(255) NULL;

-- Verify the change
DESCRIBE notification;

SELECT 'Migration complete! title column is now nullable.' AS Status;
