CREATE DATABASE IF NOT EXISTS college_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE college_db;

CREATE TABLE role (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  department VARCHAR(100),
  year INT,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(role_id)
);

CREATE TABLE club (
  club_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  description TEXT,
  club_head_id INT,
  club_mentor_id INT,
  FOREIGN KEY (club_head_id) REFERENCES user(user_id),
  FOREIGN KEY (club_mentor_id) REFERENCES user(user_id)
);

CREATE TABLE event (
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

CREATE TABLE approval (
  approval_id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT,
  authority_id INT,
  status VARCHAR(50),
  remarks TEXT,
  action_date TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES event(event_id),
  FOREIGN KEY (authority_id) REFERENCES user(user_id)
);

CREATE TABLE audit_log (
  log_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);

USE college_db;

CREATE TABLE volunteer (
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

INSERT INTO volunteer (event_id, student_id, task)
VALUES (3, 3, 'Stage Management');
