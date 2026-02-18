-- Add request_id column to notification table for permission system
USE college_db;

-- Check current notification table structure
DESCRIBE notification;

-- Add request_id column (run this even if it might error - it's safe)
-- If column already exists, you'll get an error but it won't break anything
ALTER TABLE notification 
ADD COLUMN request_id INT NULL AFTER user_id;

-- Add foreign key constraint
ALTER TABLE notification
ADD CONSTRAINT fk_notification_request
FOREIGN KEY (request_id) REFERENCES permission_request(request_id) ON DELETE CASCADE;

-- Verify the change
DESCRIBE notification;

SELECT 'Migration complete! request_id column added to notification table.' AS Status;
