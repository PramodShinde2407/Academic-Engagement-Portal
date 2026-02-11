-- Club Mentor Key System Schema Updates
-- Adds club_mentor_key column to enable key-based mentor registration

USE college_db;

-- Add club_mentor_key column to club table
-- This will store unique key for club mentor registration
ALTER TABLE club ADD COLUMN IF NOT EXISTS club_mentor_key VARCHAR(100) UNIQUE;

-- Verify the changes
SELECT 'Schema updates completed successfully!' as Status;

-- Show updated club table structure
DESCRIBE club;
