-- Permission Email Notifications Schema Updates
-- Adds permission_emails column to club and event tables

USE college_db;

-- Add permission_emails column to club table
-- This will store comma-separated email addresses that receive notifications
-- when someone enrolls in the club
ALTER TABLE club ADD COLUMN IF NOT EXISTS permission_emails TEXT;

-- Add permission_emails column to event table (if it exists)
-- This will store comma-separated email addresses that receive notifications
-- when someone registers for the event
ALTER TABLE event ADD COLUMN IF NOT EXISTS permission_emails TEXT;

-- Verify the changes
SELECT 'Schema updates completed successfully!' as Status;

-- Show updated club table structure
DESCRIBE club;

-- Show updated event table structure (if exists)
DESCRIBE event;
