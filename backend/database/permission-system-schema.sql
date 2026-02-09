-- Multi-Level Permission & Approval System Database Schema
-- Creates tables for permission requests, approval workflow, and notifications

-- =====================================================
-- Table 1: permission_request
-- Stores event permission requests created by Club Head
-- =====================================================
CREATE TABLE IF NOT EXISTS permission_request (
  request_id INT PRIMARY KEY AUTO_INCREMENT,
  club_head_id INT NOT NULL,
  club_id INT,
  
  -- Request Details
  subject VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(150) NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Status Tracking
  current_status ENUM(
    'pending_club_mentor',
    'pending_estate_manager',
    'pending_principal',
    'pending_director',
    'approved',
    'rejected'
  ) DEFAULT 'pending_club_mentor',
  
  current_approver_role VARCHAR(50) DEFAULT 'Club Mentor',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (club_head_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (club_id) REFERENCES club(club_id) ON DELETE SET NULL,
  
  INDEX idx_status (current_status),
  INDEX idx_club_head (club_head_id),
  INDEX idx_approver_role (current_approver_role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table 2: approval_action
-- Tracks each approval/rejection action in the workflow
-- =====================================================
CREATE TABLE IF NOT EXISTS approval_action (
  action_id INT PRIMARY KEY AUTO_INCREMENT,
  request_id INT NOT NULL,
  
  -- Who acted
  approver_id INT NOT NULL,
  approver_role VARCHAR(50) NOT NULL,
  
  -- Action details
  action ENUM('approved', 'rejected') NOT NULL,
  remarks TEXT,
  
  -- When
  action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (request_id) REFERENCES permission_request(request_id) ON DELETE CASCADE,
  FOREIGN KEY (approver_id) REFERENCES user(user_id) ON DELETE CASCADE,
  
  INDEX idx_request (request_id),
  INDEX idx_approver (approver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table 3: notification
-- Stores notifications for users (approval needed, approved, rejected)
-- =====================================================
CREATE TABLE IF NOT EXISTS notification (
  notification_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  request_id INT,
  
  message TEXT NOT NULL,
  type ENUM('approval_needed', 'approved', 'rejected', 'final_approval') DEFAULT 'approval_needed',
  is_read BOOLEAN DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (request_id) REFERENCES permission_request(request_id) ON DELETE CASCADE,
  
  INDEX idx_user (user_id),
  INDEX idx_unread (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Verification Queries
-- =====================================================
SELECT 'Tables created successfully!' as Status;

SHOW TABLES LIKE '%permission%';
SHOW TABLES LIKE '%approval%';
SHOW TABLES LIKE '%notification%';
