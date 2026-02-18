-- =====================================================
-- CREATE EVENT_REGISTRATION TABLE
-- This table stores student registrations for events
-- =====================================================

USE college_db;

CREATE TABLE IF NOT EXISTS event_registration (
  registration_id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  student_id INT NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  department VARCHAR(100),
  year INT,
  roll_no VARCHAR(50),
  notes TEXT,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES user(user_id) ON DELETE CASCADE,
  
  -- Prevent duplicate registrations
  UNIQUE KEY unique_event_registration (event_id, student_id)
);

-- Verify the table was created
SELECT 'event_registration table created successfully!' AS Status;

-- Show the table structure
DESCRIBE event_registration;
