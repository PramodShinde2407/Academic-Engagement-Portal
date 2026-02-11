-- Club Registration & Notification System Schema
-- Run this file to create all necessary tables

USE college_db;

-- 1. Club Registrations Table
CREATE TABLE IF NOT EXISTS club_registrations (
  registration_id INT PRIMARY KEY AUTO_INCREMENT,
  club_id INT NOT NULL,
  user_id INT NULL,  -- NULL if user not logged in
  full_name VARCHAR(100) NOT NULL,
  personal_email VARCHAR(100) NOT NULL,
  college_email VARCHAR(100) NOT NULL,
  statement_of_purpose TEXT NOT NULL,
  profile_photo_url VARCHAR(255),  -- Path to uploaded JPG
  status VARCHAR(50) DEFAULT 'pending',  -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id) REFERENCES club(club_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE SET NULL,
  INDEX idx_club_id (club_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Club Interest Table (for "Notify Me" feature)
CREATE TABLE IF NOT EXISTS club_interest (
  interest_id INT PRIMARY KEY AUTO_INCREMENT,
  club_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notified BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (club_id) REFERENCES club(club_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  UNIQUE KEY unique_interest (club_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Notifications Table (Global notification system)
CREATE TABLE IF NOT EXISTS notifications (
  notification_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',  -- info, success, warning, error
  link VARCHAR(255),  -- Optional link to relevant page
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  INDEX idx_user_read (user_id, is_read),
  INDEX idx_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Update Club Table (add registration status fields)
ALTER TABLE club 
ADD COLUMN IF NOT EXISTS registration_open BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS registration_deadline DATE NULL;

-- Verify tables created
SHOW TABLES LIKE '%registration%';
SHOW TABLES LIKE '%interest%';
SHOW TABLES LIKE 'notifications';

SELECT 'Club Registration System tables created successfully!' AS status;
