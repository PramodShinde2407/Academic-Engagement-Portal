-- Add key tables for new roles
CREATE TABLE IF NOT EXISTS club_mentor_key (
  key_id INT PRIMARY KEY AUTO_INCREMENT,
  key_value VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS estate_manager_key (
  key_id INT PRIMARY KEY AUTO_INCREMENT,
  key_value VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS principal_key (
  key_id INT PRIMARY KEY AUTO_INCREMENT,
  key_value VARCHAR(100) UNIQUE NOT NULL,
  used BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS director_key (
  key_id INT PRIMARY KEY AUTO_INCREMENT,
  key_value VARCHAR(100) UNIQUE NOT NULL,
  used BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample keys for testing
INSERT IGNORE INTO club_mentor_key (key_value) VALUES
('CLUB_MENTOR_KEY_2024');

INSERT IGNORE INTO estate_manager_key (key_value) VALUES
('ESTATE_MANAGER_KEY_2024');

INSERT IGNORE INTO principal_key (key_value, used) VALUES
('PRINCIPAL_KEY_2024', 0);

INSERT IGNORE INTO director_key (key_value, used) VALUES
('DIRECTOR_KEY_2024', 0);

-- Verify
SELECT 'Club Mentor Keys:' as Info;
SELECT * FROM club_mentor_key;

SELECT 'Estate Manager Keys:' as Info;
SELECT * FROM estate_manager_key;

SELECT 'Principal Keys:' as Info;
SELECT * FROM principal_key;

SELECT 'Director Keys:' as Info;
SELECT * FROM director_key;
