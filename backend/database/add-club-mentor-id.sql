-- Add club_mentor_id to the club table
USE college_db;

-- Add the club_mentor_id column
ALTER TABLE club 
ADD COLUMN club_mentor_id INT NULL AFTER club_head_id,
ADD FOREIGN KEY (club_mentor_id) REFERENCES user(user_id);

-- Verify the change
DESCRIBE club;
