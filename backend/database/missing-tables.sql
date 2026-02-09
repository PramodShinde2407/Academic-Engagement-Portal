-- Missing tables for registration key validation
USE college_db;

-- Table for admin registration keys
CREATE TABLE IF NOT EXISTS admin_key (
  key_id INT PRIMARY KEY AUTO_INCREMENT,
  key_value VARCHAR(100) UNIQUE NOT NULL,
  used BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for faculty registration keys
CREATE TABLE IF NOT EXISTS faculty_key (
  key_id INT PRIMARY KEY AUTO_INCREMENT,
  key_value VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add secret_key column to club table if it doesn't exist
ALTER TABLE club ADD COLUMN IF NOT EXISTS secret_key VARCHAR(100) UNIQUE;

-- Insert sample roles if they don't exist
INSERT IGNORE INTO role (role_id, role_name) VALUES
(1, 'Student'),
(2, 'Faculty'),
(3, 'Admin'),
(4, 'Club Head');

-- Insert sample admin key (for testing)
INSERT IGNORE INTO admin_key (key_value, used) VALUES
('ADMIN_KEY_2024', 0);

-- Insert sample faculty key (for testing)
INSERT IGNORE INTO faculty_key (key_value) VALUES
('FACULTY_KEY_2024');

-- Insert sample club with secret key (for testing)
INSERT IGNORE INTO club (name, description, secret_key) VALUES
('Tech Club', 'Technology and Innovation Club', 'TECH_CLUB_SECRET_2024');
