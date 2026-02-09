-- Complete Database Setup Script
-- This creates the database, all tables, and inserts initial data

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS college_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE college_db;

-- Step 2: Create all tables
CREATE TABLE IF NOT EXISTS role (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  department VARCHAR(100),
  year INT,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(role_id)
);

CREATE TABLE IF NOT EXISTS club (
  club_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  description TEXT,
  club_head_id INT,
  secret_key VARCHAR(100) UNIQUE,
  FOREIGN KEY (club_head_id) REFERENCES user(user_id)
);

CREATE TABLE IF NOT EXISTS event (
  event_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(150),
  description TEXT,
  date DATE,
  venue VARCHAR(100),
  status VARCHAR(50),
  club_id INT,
  organizer_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id) REFERENCES club(club_id),
  FOREIGN KEY (organizer_id) REFERENCES user(user_id)
);

CREATE TABLE IF NOT EXISTS approval (
  approval_id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT,
  authority_id INT,
  status VARCHAR(50),
  remarks TEXT,
  action_date TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES event(event_id),
  FOREIGN KEY (authority_id) REFERENCES user(user_id)
);

CREATE TABLE IF NOT EXISTS audit_log (
  log_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE IF NOT EXISTS volunteer (
  volunteer_id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  student_id INT NOT NULL,
  task VARCHAR(100),
  attendance BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (event_id) REFERENCES event(event_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (student_id) REFERENCES user(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  UNIQUE KEY unique_volunteer (event_id, student_id)
);

-- Step 3: Create key validation tables
CREATE TABLE IF NOT EXISTS admin_key (
  key_id INT PRIMARY KEY AUTO_INCREMENT,
  key_value VARCHAR(100) UNIQUE NOT NULL,
  used BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faculty_key (
  key_id INT PRIMARY KEY AUTO_INCREMENT,
  key_value VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Insert roles
INSERT IGNORE INTO role (role_id, role_name) VALUES
(1, 'Student'),
(2, 'Faculty'),
(3, 'Admin'),
(4, 'Club Head');

-- Step 5: Insert test keys
INSERT IGNORE INTO admin_key (key_value, used) VALUES
('ADMIN_KEY_2024', 0);

INSERT IGNORE INTO faculty_key (key_value) VALUES
('FACULTY_KEY_2024');

-- Step 6: Insert sample club with secret key
INSERT IGNORE INTO club (name, description, secret_key) VALUES
('Tech Club', 'Technology and Innovation Club', 'TECH_CLUB_SECRET_2024');

-- Verify setup
SELECT 'Roles:' as Info;
SELECT * FROM role ORDER BY role_id;

SELECT 'Admin Keys:' as Info;
SELECT * FROM admin_key;

SELECT 'Faculty Keys:' as Info;
SELECT * FROM faculty_key;

SELECT 'Clubs:' as Info;
SELECT club_id, name, secret_key FROM club;
