-- Database Dump for college_db
-- Generated on 2026-02-19T14:33:43.729Z

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `admin_key`;
CREATE TABLE `admin_key` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key_value` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_value` (`key_value`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin_key` VALUES
(1, 'SUPERADMIN123', 0),
(2, 'ADMIN_KEY_2024', 1);

DROP TABLE IF EXISTS `approval`;
CREATE TABLE `approval` (
  `approval_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int DEFAULT NULL,
  `authority_id` int DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `action_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`approval_id`),
  KEY `event_id` (`event_id`),
  KEY `authority_id` (`authority_id`),
  CONSTRAINT `approval_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`),
  CONSTRAINT `approval_ibfk_2` FOREIGN KEY (`authority_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `approval_action`;
CREATE TABLE `approval_action` (
  `action_id` int NOT NULL AUTO_INCREMENT,
  `request_id` int NOT NULL,
  `approver_id` int NOT NULL,
  `approver_role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` enum('approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `action_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`action_id`),
  KEY `idx_request` (`request_id`),
  KEY `idx_approver` (`approver_id`),
  CONSTRAINT `approval_action_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `permission_request` (`request_id`) ON DELETE CASCADE,
  CONSTRAINT `approval_action_ibfk_2` FOREIGN KEY (`approver_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `approval_action` VALUES
(1, 1, 7, 'Club Mentor', 'approved', NULL, '2026-02-04 14:15:44'),
(2, 1, 8, 'Estate Manager', 'approved', NULL, '2026-02-04 14:17:41'),
(3, 1, 9, 'Principal', 'approved', NULL, '2026-02-04 14:19:33'),
(4, 1, 10, 'Director', 'approved', NULL, '2026-02-04 14:21:39'),
(5, 2, 7, 'Club Mentor', 'rejected', 'you are doing worng man!!', '2026-02-04 14:27:03'),
(6, 3, 7, 'Club Mentor', 'approved', NULL, '2026-02-04 16:57:36'),
(7, 3, 8, 'Estate Manager', 'approved', NULL, '2026-02-04 16:58:37'),
(8, 3, 9, 'Principal', 'approved', NULL, '2026-02-04 16:59:15'),
(9, 3, 10, 'Director', 'rejected', 'not proper information', '2026-02-04 17:00:02'),
(10, 4, 7, 'Club Mentor', 'approved', NULL, '2026-02-06 06:54:52'),
(11, 8, 14, 'Club Mentor', 'approved', NULL, '2026-02-11 14:17:06'),
(12, 8, 8, 'Estate Manager', 'approved', NULL, '2026-02-11 14:18:07'),
(13, 22, 14, 'Club Mentor', 'approved', NULL, '2026-02-13 06:09:50'),
(14, 22, 8, 'Estate Manager', 'approved', NULL, '2026-02-13 06:10:22'),
(15, 22, 9, 'Principal', 'approved', NULL, '2026-02-13 06:10:58'),
(16, 22, 10, 'Director', 'approved', NULL, '2026-02-13 06:11:51'),
(17, 4, 8, 'Estate Manager', 'rejected', 'i dont like you', '2026-02-18 17:59:00'),
(18, 8, 9, 'Principal', 'rejected', 'no', '2026-02-18 18:01:11');

DROP TABLE IF EXISTS `audit_log`;
CREATE TABLE `audit_log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_id` int DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `audit_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `club`;
CREATE TABLE `club` (
  `club_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `club_head_id` int DEFAULT NULL,
  `club_mentor_id` int DEFAULT NULL,
  `secret_key` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tagline` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `activities` text COLLATE utf8mb4_unicode_ci,
  `is_registration_open` tinyint(1) DEFAULT '0',
  `registration_deadline` date DEFAULT NULL,
  `permission_emails` text COLLATE utf8mb4_unicode_ci,
  `club_mentor_key` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`club_id`),
  UNIQUE KEY `secret_key` (`secret_key`),
  UNIQUE KEY `secret_key_2` (`secret_key`),
  UNIQUE KEY `club_mentor_key` (`club_mentor_key`),
  KEY `fk_club_mentor` (`club_mentor_id`),
  CONSTRAINT `fk_club_mentor` FOREIGN KEY (`club_mentor_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `club` VALUES
(5, 'Photography Club', 'Capture moments and improve photography skills.', 6, NULL, 'CLUB1005', '', '', NULL, 0, NULL, NULL, NULL),
(6, 'Drama Club', 'Acting, plays, and theater productions.', 7, NULL, 'CLUB1006', '', '', NULL, 0, NULL, NULL, NULL),
(7, 'Sports Club', 'Participate in various college sports.', 8, NULL, 'CLUB1007', '', '', NULL, 0, NULL, NULL, NULL),
(8, 'Art Club', 'Painting, sketching, and creative arts.', 9, NULL, 'CLUB1008', '', '', NULL, 0, NULL, NULL, NULL),
(9, 'Science Club', 'Explore experiments and scientific projects.', 10, NULL, 'CLUB1009', '', '', NULL, 0, NULL, NULL, NULL),
(10, 'Literature Club', 'Read, write, and discuss literature.', 1, NULL, 'CLUB1010', '', '', NULL, 0, NULL, NULL, NULL),
(11, 'Tech Club', 'Technology and Innovation Club', 6, NULL, 'TECH_CLUB_SECRET_2024', '', '', NULL, 0, NULL, NULL, NULL),
(12, 'NEW_CLUB', 'na', NULL, NULL, 'NEW_CLUB_2024', '', '', NULL, 0, NULL, NULL, NULL),
(13, 'PICT_NSS', 'NOT ME BUT YOU', NULL, NULL, 'pict head key', '', '', NULL, 0, NULL, NULL, 'pict mentor key'),
(15, 'nss Pict', 'not me but you', NULL, NULL, 'nssheadkey', '', '', NULL, 0, NULL, NULL, 'mentorkey'),
(17, 'PICT NSS', 'NOT ME BUT WE ALL', 12, 13, 'pictnsshead', '', '', NULL, 0, NULL, NULL, 'pictnssmentor'),
(18, 'pict art circle', 'all good', NULL, NULL, 'pictarthead', '', '', NULL, 0, NULL, NULL, 'pictardmentor'),
(19, 'CSI', 'Coding club', 15, 14, 'csihead', '', '', NULL, 0, NULL, NULL, 'csimentor'),
(20, 'AWS', 'club related to cloud', 21, 22, 'aws_club_head', '', '', NULL, 0, NULL, NULL, 'aws_club_mentor');

DROP TABLE IF EXISTS `club_application`;
CREATE TABLE `club_application` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `club_id` int NOT NULL,
  `user_id` int NOT NULL,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `personal_email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `college_email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roll_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` int DEFAULT NULL,
  `division` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_no` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statement_of_purpose` text COLLATE utf8mb4_unicode_ci,
  `photo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `head_approval_status` enum('Pending','Approved','Rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `mentor_approval_status` enum('Pending','Approved','Rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  PRIMARY KEY (`application_id`),
  UNIQUE KEY `unique_application` (`club_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `club_application_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `club` (`club_id`) ON DELETE CASCADE,
  CONSTRAINT `club_application_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `club_application` VALUES
(1, 5, 17, 'Test Student', 'test@gmail.com', 'testuser1770721693388@pict.edu', '12345', 'CE', 3, 'A', '1234567890', 'I want to join.', '/uploads/club-registrations/profile-1770721693956-701676417.png', 'Pending', '2026-02-10 11:08:13', 'Approved', 'Pending'),
(2, 19, 4, 'ram', 'ram@gmail.com', 'e2kram@pict.edu', '32432', 'entc', 3, 'C', '1234567890', 'i like this club', '/uploads/club-registrations/profile-1770721795379-955323076.jpg', 'Approved', '2026-02-10 11:09:55', 'Approved', 'Approved'),
(3, 19, 18, 'pict', 'pict@gmail.com', 'pic@pict.edu', 'e2k348938@ms.pict.edu', 'entc', 1, 'B', '0987654321', 'i like this club', '/uploads/club-registrations/profile-1770963930980-571135025.jpg', 'Approved', '2026-02-13 06:25:31', 'Approved', 'Approved'),
(4, 5, 4, 'jon', 'jon@gmail.com', 'jon@pict.edu', '2345', 'entc', 2, 'C', '0987654321', 'loved club', '/uploads/club-registrations/profile-1771002916971-902707429.jpg', 'Pending', '2026-02-13 17:15:16', 'Approved', 'Pending'),
(5, 19, 19, 'kaju katli', 'kaju@gmail.com', 'e2k3489@pict.edu', '32366', 'cs', 2, 'C', '1234567890', 'i like this club', '/uploads/club-registrations/profile-1771004288408-635815506.jpg', 'Approved', '2026-02-13 17:38:08', 'Approved', 'Approved'),
(6, 20, 4, 'jon ka don', 'jon@gmail.com', 'e2k231245@pict.edu', '3452', 'cs', 2, '6', '0987654321', 'looking forward to join this club', '/uploads/club-registrations/profile-1771086293629-487674565.jpg', 'Approved', '2026-02-14 16:24:53', 'Approved', 'Approved'),
(7, 20, 20, 'ladu ', 'ladu@gmail.com', 'e2k231245@pict.edu', '2345', 'entc', 3, '6', '9988776655', 'i am interested in cloud computing', '/uploads/club-registrations/profile-1771425924399-638369983.jpg', 'Approved', '2026-02-18 14:45:24', 'Approved', 'Approved'),
(9, 20, 19, 'kaju', 'kaju@gmail.com', 'e2kr@pict.edu', '1234', 'cs', 3, '6', '0987654321', 'i loved this club', '/uploads/club-registrations/profile-1771089663162-631897143.jpg', 'Approved', '2026-02-14 17:21:03', 'Approved', 'Approved'),
(10, 20, 23, 'hruta', 'hruta@gmail.com', 'e2k4528@pict.edu', '23456', 'entc', 2, '6', '8796084523', 'i love cloud computing', '/uploads/club-registrations/profile-1771509127030-444302683.png', 'Approved', '2026-02-19 13:52:07', 'Approved', 'Approved'),
(11, 19, 23, 'hruta', 'hruta@gmail.com', 'e2k451235@pict.edu', '32367', 'entc', 3, '7', '9876054321', 'i like coding', '/uploads/club-registrations/profile-1771509717280-861234621.png', 'Approved', '2026-02-19 14:01:57', 'Approved', 'Approved');

DROP TABLE IF EXISTS `club_interest`;
CREATE TABLE `club_interest` (
  `interest_id` int NOT NULL AUTO_INCREMENT,
  `club_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `notified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`interest_id`),
  UNIQUE KEY `unique_interest` (`club_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `club_interest_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `club` (`club_id`) ON DELETE CASCADE,
  CONSTRAINT `club_interest_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `club_member`;
CREATE TABLE `club_member` (
  `id` int NOT NULL AUTO_INCREMENT,
  `club_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `student_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `branch` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` int DEFAULT NULL,
  `roll_no` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_club_member_club` (`club_id`),
  KEY `fk_club_member_user` (`user_id`),
  CONSTRAINT `fk_club_member_club` FOREIGN KEY (`club_id`) REFERENCES `club` (`club_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_club_member_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `club_member` VALUES
(1, 19, 15, 'csi head', 'chcsi@gamil.com', 'entc', 2, NULL, '2026-02-10 09:54:59'),
(2, 19, 19, 'kaju katli', 'e2k3489@pict.edu', 'cs', 2, '32366', '2026-02-13 17:39:34'),
(3, 19, 4, 'ram', 'e2kram@pict.edu', 'entc', 3, '32432', '2026-02-13 17:39:34'),
(4, 20, 21, 'spider man', 'chaws@gmail.com', 'entc', 2, NULL, '2026-02-14 16:01:31'),
(5, 20, 22, 'super man', 'cmaws@gmail.com', 'entc', NULL, NULL, '2026-02-14 16:17:40'),
(6, 20, 4, 'jon ka don', 'e2k231245@pict.edu', 'cs', 2, '3452', '2026-02-14 16:25:58'),
(7, 20, 19, 'kaju', 'e2kr@pict.edu', 'cs', 3, '1234', '2026-02-14 17:22:56'),
(8, 20, 20, 'ladu ', 'e2k231245@pict.edu', 'entc', 3, '2345', '2026-02-18 14:47:39'),
(9, 20, 23, 'hruta', 'e2k4528@pict.edu', 'entc', 2, '23456', '2026-02-19 13:54:09'),
(10, 19, 23, 'hruta', 'e2k451235@pict.edu', 'entc', 3, '32367', '2026-02-19 14:04:01');

DROP TABLE IF EXISTS `club_mentor_key`;
CREATE TABLE `club_mentor_key` (
  `key_id` int NOT NULL AUTO_INCREMENT,
  `key_value` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`key_id`),
  UNIQUE KEY `key_value` (`key_value`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `club_mentor_key` VALUES
(1, 'CLUB_MENTOR_KEY_2024', '2026-02-04 11:38:56');

DROP TABLE IF EXISTS `director_key`;
CREATE TABLE `director_key` (
  `key_id` int NOT NULL AUTO_INCREMENT,
  `key_value` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`key_id`),
  UNIQUE KEY `key_value` (`key_value`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `director_key` VALUES
(1, 'DIRECTOR_KEY_2024', 1, '2026-02-04 11:38:56');

DROP TABLE IF EXISTS `estate_manager_key`;
CREATE TABLE `estate_manager_key` (
  `key_id` int NOT NULL AUTO_INCREMENT,
  `key_value` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`key_id`),
  UNIQUE KEY `key_value` (`key_value`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `estate_manager_key` VALUES
(1, 'ESTATE_MANAGER_KEY_2024', '2026-02-04 11:38:56');

DROP TABLE IF EXISTS `event`;
CREATE TABLE `event` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `venue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `club_id` int DEFAULT NULL,
  `organizer_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `additional_info` text COLLATE utf8mb4_unicode_ci,
  `conducted_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permission_emails` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `event` VALUES
(1, 'Cyber Security Bootcamp', 'Learn ethical hacking and security fundamentals', '2026-02-11 18:30:00', 'Lab 202', 'APPROVED', 1, 2, '2026-02-03 14:22:49', NULL, NULL, NULL),
(2, 'Startup Pitch Day', 'Students pitch startup ideas to investors', '2026-02-17 18:30:00', 'Seminar Hall', 'APPROVED', 2, 3, '2026-02-03 14:22:49', NULL, NULL, NULL),
(3, 'Cloud Computing Workshop', 'AWS and Azure hands-on workshop', '2026-02-24 18:30:00', 'Lab 305', 'APPROVED', 1, 2, '2026-02-03 14:22:49', NULL, NULL, NULL),
(4, 'UI/UX Design Sprint', 'Design thinking and prototyping session', '2026-03-01 18:30:00', 'Design Studio', 'APPROVED', 3, 4, '2026-02-03 14:22:49', NULL, NULL, NULL),
(5, 'Robotics Challenge', 'Build and compete with autonomous robots', '2026-03-07 18:30:00', 'Robotics Lab', 'APPROVED', 2, 3, '2026-02-03 14:22:49', NULL, NULL, NULL),
(6, 'Open Mic Night', 'Music, poetry, and stand-up comedy', '2026-03-11 18:30:00', 'Open Amphitheatre', 'APPROVED', 4, 5, '2026-02-03 14:22:49', NULL, NULL, NULL),
(7, 'Data Science Hackday', 'Solve real-world problems using data', '2026-03-17 18:30:00', 'Lab 110', 'APPROVED', 1, 2, '2026-02-03 14:22:49', NULL, NULL, NULL),
(8, 'Photography Walk', 'Outdoor photography and editing basics', '2026-03-21 18:30:00', 'College Campus', 'APPROVED', 5, 6, '2026-02-03 14:22:49', NULL, NULL, NULL),
(9, 'Blockchain Fundamentals', 'Introduction to blockchain and smart contracts', '2026-03-27 18:30:00', 'Seminar Room 2', 'APPROVED', 3, 4, '2026-02-03 14:22:49', NULL, NULL, NULL),
(10, 'Sports Meet 2026', 'Annual inter-department sports competition', '2026-04-01 18:30:00', 'Sports Ground', 'APPROVED', 7, 7, '2026-02-03 14:22:49', NULL, NULL, NULL),
(11, 'addition', 'good', '2005-12-23 18:30:00', 'pict big ground', 'PENDING', 19, 15, '2026-02-10 17:11:59', NULL, NULL, NULL),
(12, 'csi xenia', 'its coding competition', '2026-12-19 18:30:00', 'auditioriam', 'PENDING', 19, 15, '2026-02-13 06:30:02', NULL, NULL, NULL),
(13, 'CSI NON TECH', 'Soft Skill', '2005-12-23 18:30:00', 'playground', 'APPROVED', 19, 15, '2026-02-14 13:57:33', NULL, NULL, NULL),
(14, 'CSI Test Event', 'Testing notifications', '2026-02-28 18:30:00', 'Lab 1', 'APPROVED', 19, 15, '2026-02-14 14:06:59', NULL, NULL, NULL),
(15, 'Introduction to cloud computing', 'cloud from the basic to advance', '2026-12-23 18:30:00', 'entc seminar hall', 'APPROVED', 20, 21, '2026-02-14 16:20:02', NULL, NULL, NULL),
(16, 'aws explore', 'advanced cloud concepts', '2026-12-11 18:30:00', 'auditoriam', 'APPROVED', 20, 21, '2026-02-18 08:49:00', NULL, NULL, NULL),
(17, 'full aws ', 'detailes cloud computing', '2026-12-23 18:30:00', 'auditoriam', 'APPROVED', 20, 21, '2026-02-18 09:05:44', NULL, NULL, NULL),
(18, 'cloud computing with aws', 'imporat for all student', '2026-09-23 18:30:00', 'auditoriam', 'APPROVED', 5, 6, '2026-02-18 09:23:18', NULL, NULL, NULL),
(19, 'IMP SERVICES OF AWS', 'EC2, lambda, S3 ,IAM demonstarion', '2026-02-28 18:30:00', 'auditoriam', 'APPROVED', 20, 21, '2026-02-18 10:27:32', NULL, NULL, NULL),
(20, 'aws', 'na', '2005-12-23 18:30:00', 'auditoriam', 'APPROVED', 20, 21, '2026-02-18 14:01:16', 'give votes', 'Shinde sarkar', NULL);

DROP TABLE IF EXISTS `event_registration`;
CREATE TABLE `event_registration` (
  `registration_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `student_id` int NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` int DEFAULT NULL,
  `roll_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `registered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`registration_id`),
  UNIQUE KEY `unique_event_registration` (`event_id`,`student_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `event_registration_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`) ON DELETE CASCADE,
  CONSTRAINT `event_registration_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `event_registration` VALUES
(2, 12, 4, 'jon', 'jon@gmail.com', '1234567890', 'entc', 1, '32356', 'no', '2026-02-13 17:30:42'),
(3, 12, 19, 'kaju katli', 'kaju@gmail.com', '1234567890', 'entc', 2, '32356', 'na', '2026-02-13 17:45:13'),
(4, 12, 20, 'ladu motha', 'ladu@gmail.com', '1234567890', 'entc', 3, '3455', 'na', '2026-02-13 17:53:05'),
(5, 13, 20, 'ladu kadu', 'ladu@gmail.com', '1234567890', 'entc', 2, '32369', 'no', '2026-02-14 14:00:51'),
(6, 15, 4, 'jon the don', 'jon@gmail.com', '1234567890', 'entc', 1, '2345', 'looking forward to join the session', '2026-02-14 16:21:48'),
(7, 15, 19, 'kaju katli', 'kaju@gmail.com', '09309386007', 'entc', 2, '23234', 'NA', '2026-02-15 04:20:54'),
(8, 15, 20, 'ladu', 'ladu@gmail.com', '1234455662', 'entc', 1, '32345', 'NA', '2026-02-15 11:04:09'),
(9, 16, 20, 'ladu', 'ladu@gmail.com', '1234567879', 'entc', 0, '32389', 'i am looking forward for this', '2026-02-18 08:49:59'),
(10, 17, 22, 'club  mentor aws', 'cmaws@gmail.com', '9988776655', 'etc', 4, '2132', 'na', '2026-02-18 09:07:45'),
(11, 18, 20, 'ladu', 'ladu@gmail.com', '6655443322', 'cs', 2, '23456', 'no', '2026-02-18 09:24:50'),
(13, 18, 19, 'kaju', 'kaju@gmail.com', '2233445566', 'entc', 0, '32344', 'no', '2026-02-18 09:40:22'),
(14, 17, 19, 'kaju', 'kaju@gmail.com', '1234556675', 'cs', 2, '32345', 'no', '2026-02-18 09:46:54'),
(15, 17, 20, 'ladu', 'ladu@gmail.com', '1234567890', 'entc', 1, '12345', 'no', '2026-02-18 10:03:20'),
(16, 18, 23, 'hruta', 'hruta@gmail.com', '9988776655', 'cs', 2, '32367', 'no', '2026-02-18 10:07:36'),
(17, 16, 23, 'hruta', 'hruta@gmail.com', '8903729033', 'cs', 3, '23245', 'no', '2026-02-18 10:22:49'),
(18, 19, 20, 'ladu', 'ladu@gmail.com', '1234567890', 'entc', 2, '23456', 'no', '2026-02-18 10:28:55'),
(19, 20, 20, 'ladu', 'ladu@gmail.com', '1234567890', 'cs', 3, '2345', 'no', '2026-02-18 14:09:51'),
(20, 20, 19, 'kaju', 'kaju@gmail.com', '1234567890', 'entc', 2, '23456', 'looking forward to join the session', '2026-02-18 14:27:17'),
(21, 20, 23, 'hruta', 'hruta@gmail.com', '1234567890', 'entc', 1, '23456', 'no', '2026-02-19 13:55:28');

DROP TABLE IF EXISTS `faculty_key`;
CREATE TABLE `faculty_key` (
  `key_id` int NOT NULL AUTO_INCREMENT,
  `key_value` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`key_id`),
  UNIQUE KEY `key_value` (`key_value`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `faculty_key` VALUES
(1, 'FACULTY_KEY_2024', '2026-02-04 08:35:57');

DROP TABLE IF EXISTS `notification`;
CREATE TABLE `notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `request_id` int DEFAULT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'GENERAL',
  `link` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  KEY `fk_notification_request` (`request_id`),
  CONSTRAINT `fk_notification_request` FOREIGN KEY (`request_id`) REFERENCES `permission_request` (`request_id`) ON DELETE CASCADE,
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `notification` VALUES
(1, 6, NULL, 'New Club Registration', 'Test Student has applied to join Photography Club', 'info', '/clubs/5/applications', 1, '2026-02-10 11:08:13'),
(2, 15, NULL, 'New Club Registration', 'ram has applied to join CSI', 'info', '/clubs/19/applications', 1, '2026-02-10 11:09:55'),
(3, 14, NULL, 'New Club Registration', 'ram has applied to join CSI', 'info', '/clubs/19/applications', 1, '2026-02-10 11:09:55'),
(5, 14, 22, 'Action Required', 'New permission request: "coding rounds" requires your approval', 'approval_needed', NULL, 1, '2026-02-13 06:08:36'),
(6, 8, 22, 'Action Required', 'Permission request: "coding rounds" requires your approval', 'approval_needed', NULL, 1, '2026-02-13 06:09:50'),
(7, 9, 22, 'Action Required', 'Permission request: "coding rounds" requires your approval', 'approval_needed', NULL, 1, '2026-02-13 06:10:22'),
(8, 10, 22, 'Action Required', 'Permission request: "coding rounds" requires your approval', 'approval_needed', NULL, 1, '2026-02-13 06:10:58'),
(9, 15, 22, 'Request Approved', 'Your permission request "coding rounds" has been APPROVED by all authorities!', 'final_approval', NULL, 1, '2026-02-13 06:11:51'),
(10, 14, 22, 'Request Approved', 'Permission request "coding rounds" has been APPROVED by all authorities!', 'final_approval', NULL, 1, '2026-02-13 06:11:51'),
(11, 15, NULL, 'New Club Registration', 'pict has applied to join CSI', 'info', '/clubs/19/applications', 1, '2026-02-13 06:25:31'),
(12, 14, NULL, 'New Club Registration', 'pict has applied to join CSI', 'info', '/clubs/19/applications', 1, '2026-02-13 06:25:31'),
(13, 6, NULL, 'New Club Registration', 'jon has applied to join Photography Club', 'info', '/clubs/5/applications', 1, '2026-02-13 17:15:17'),
(14, 15, NULL, 'New Club Registration', 'kaju katli has applied to join CSI', 'info', '/clubs/19/applications', 1, '2026-02-13 17:38:08'),
(15, 14, NULL, 'New Club Registration', 'kaju katli has applied to join CSI', 'info', '/clubs/19/applications', 1, '2026-02-13 17:38:08'),
(16, 18, NULL, 'Welcome to CSI!', 'Congratulations! Your application has been fully approved. You are now a member.', 'success', NULL, 0, '2026-02-13 17:39:34'),
(17, 4, NULL, 'Welcome to CSI!', 'Congratulations! Your application has been fully approved. You are now a member.', 'success', NULL, 0, '2026-02-13 17:39:34'),
(18, 19, NULL, 'Welcome to CSI!', 'Congratulations! Your application has been fully approved. You are now a member.', 'success', NULL, 1, '2026-02-13 17:39:34'),
(19, 15, NULL, 'TEST NOTIFICATION', 'This is a direct test of the notification system.', 'info', '/dashboard', 1, '2026-02-14 14:08:12'),
(20, 21, NULL, 'New Club Registration', 'jon ka don has applied to join AWS', 'info', '/clubs/20/applications', 1, '2026-02-14 16:24:53'),
(21, 22, NULL, 'New Club Registration', 'jon ka don has applied to join AWS', 'info', '/clubs/20/applications', 1, '2026-02-14 16:24:53'),
(22, 4, NULL, 'Welcome to AWS!', 'Congratulations! Your application has been fully approved. You are now a member.', 'success', NULL, 1, '2026-02-14 16:25:58'),
(23, 21, NULL, 'New Club Membership Request', 'ladu  has requested to join AWS. Review application now.', 'action_required', '/clubs/20/applications', 1, '2026-02-14 17:09:47'),
(24, 22, NULL, 'New Club Membership Request', 'ladu  has requested to join AWS. Review application now.', 'action_required', '/clubs/20/applications', 1, '2026-02-14 17:09:47'),
(25, 20, NULL, 'Application Update', 'Your application to join AWS has been rejected.', 'error', NULL, 1, '2026-02-14 17:12:14'),
(26, 21, NULL, 'New Club Membership Request', 'kaju has requested to join AWS. Review application now.', 'action_required', '/clubs/20/applications', 1, '2026-02-14 17:21:03'),
(27, 22, NULL, 'New Club Membership Request', 'kaju has requested to join AWS. Review application now.', 'action_required', '/clubs/20/applications', 1, '2026-02-14 17:21:03'),
(28, 19, NULL, 'Welcome to AWS!', 'Congratulations! Your application has been fully approved. You are now a member.', 'success', NULL, 1, '2026-02-14 17:22:56'),
(29, 15, NULL, 'New Event Registration', 'Test Student has registered for CSI Test Event', 'info', '/clubs/19', 1, '2026-02-15 04:29:13'),
(30, 14, NULL, 'New Event Registration', 'Test Student has registered for CSI Test Event', 'info', '/clubs/19', 1, '2026-02-15 04:29:13'),
(31, 15, NULL, 'Test Notification', 'Test message for User 15', 'info', '/test-link', 1, '2026-02-15 04:30:43'),
(32, 14, NULL, 'Test Notification', 'Test message for User 14', 'info', '/test-link', 1, '2026-02-15 04:30:43'),
(33, 6, NULL, 'New Event Registration', 'ladu has registered for cloud computing with aws', 'info', '/clubs/5', 1, '2026-02-18 09:24:50'),
(34, 6, NULL, 'New Event Registration', 'kaju has registered for cloud computing with aws', 'info', '/clubs/5', 1, '2026-02-18 09:40:22'),
(35, 6, NULL, 'New Event Registration', 'hruta has registered for cloud computing with aws', 'info', '/clubs/5', 1, '2026-02-18 10:07:36'),
(36, 21, NULL, 'New Event Registration', 'ladu has registered for IMP SERVICES OF AWS', 'info', '/clubs/20', 1, '2026-02-18 10:28:55'),
(37, 22, NULL, 'New Event Registration', 'ladu has registered for IMP SERVICES OF AWS', 'info', '/clubs/20', 1, '2026-02-18 10:28:55'),
(38, 21, NULL, 'New Event Registration', 'ladu has registered for aws', 'info', '/clubs/20', 1, '2026-02-18 14:09:51'),
(39, 22, NULL, 'New Event Registration', 'ladu has registered for aws', 'info', '/clubs/20', 1, '2026-02-18 14:09:51'),
(40, 21, NULL, 'New Event Registration', 'kaju has registered for aws', 'info', '/events/20', 1, '2026-02-18 14:27:17'),
(41, 22, NULL, 'New Event Registration', 'kaju has registered for aws', 'info', '/events/20', 1, '2026-02-18 14:27:17'),
(42, 21, NULL, 'New Club Membership Request', 'ladu  has requested to join AWS. Review application now.', 'action_required', '/clubs/20/applications', 1, '2026-02-18 14:45:24'),
(43, 22, NULL, 'New Club Membership Request', 'ladu  has requested to join AWS. Review application now.', 'action_required', '/clubs/20/applications', 1, '2026-02-18 14:45:24'),
(44, 20, NULL, 'Welcome to AWS!', 'Congratulations! Your application has been fully approved. You are now a member.', 'success', NULL, 1, '2026-02-18 14:47:39'),
(45, 6, 4, 'Request Rejected', 'Your permission request "mini project" was REJECTED by Estate Manager. Reason: i dont like you', 'rejected', NULL, 1, '2026-02-18 17:59:00'),
(46, 15, 8, 'Request Rejected', 'Your permission request "a" was REJECTED by Principal. Reason: no', 'rejected', NULL, 0, '2026-02-18 18:01:11'),
(47, 21, NULL, 'New Club Membership Request', 'hruta has requested to join AWS. Review application now.', 'action_required', '/clubs/20/applications', 1, '2026-02-19 13:52:07'),
(48, 22, NULL, 'New Club Membership Request', 'hruta has requested to join AWS. Review application now.', 'action_required', '/clubs/20/applications', 1, '2026-02-19 13:52:07'),
(49, 23, NULL, 'Welcome to AWS!', 'Congratulations! Your application has been fully approved. You are now a member.', 'success', NULL, 1, '2026-02-19 13:54:09'),
(50, 21, NULL, 'New Event Registration', 'hruta has registered for aws', 'info', '/events/20', 1, '2026-02-19 13:55:28'),
(51, 22, NULL, 'New Event Registration', 'hruta has registered for aws', 'info', '/events/20', 0, '2026-02-19 13:55:28'),
(52, 15, NULL, 'New Club Membership Request', 'hruta has requested to join CSI. Review application now.', 'action_required', '/clubs/19/applications', 1, '2026-02-19 14:01:57'),
(53, 14, NULL, 'New Club Membership Request', 'hruta has requested to join CSI. Review application now.', 'action_required', '/clubs/19/applications', 1, '2026-02-19 14:01:57'),
(54, 23, NULL, 'Welcome to CSI!', 'Congratulations! Your application has been fully approved. You are now a member.', 'success', NULL, 0, '2026-02-19 14:04:01');

DROP TABLE IF EXISTS `permission_request`;
CREATE TABLE `permission_request` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `club_head_id` int NOT NULL,
  `club_id` int DEFAULT NULL,
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `current_status` enum('pending_club_mentor','pending_estate_manager','pending_principal','pending_director','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending_club_mentor',
  `current_approver_role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Club Mentor',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  KEY `club_id` (`club_id`),
  KEY `idx_status` (`current_status`),
  KEY `idx_club_head` (`club_head_id`),
  KEY `idx_approver_role` (`current_approver_role`),
  CONSTRAINT `permission_request_ibfk_1` FOREIGN KEY (`club_head_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `permission_request_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `club` (`club_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `permission_request` VALUES
(1, 6, NULL, 'Tech fest 2024', 'Respected sir , our club is going to organize the evnet and we need your permission we have complited all foramalities . Required details are as follows', 'auditoriam', '2026-02-04 18:30:00', '10:00:00', '12:00:00', 'approved', NULL, '2026-02-04 14:11:26', '2026-02-04 14:21:39'),
(2, 6, NULL, 'INC', 'Please give me the permsision .', 'A3-101', '2026-02-06 18:30:00', '08:00:00', '10:00:00', 'rejected', NULL, '2026-02-04 14:23:49', '2026-02-04 14:27:03'),
(3, 6, NULL, 'nss', 'give me permission', 'entc seminar hall', '2026-02-08 18:30:00', '10:00:00', '12:00:00', 'rejected', NULL, '2026-02-04 16:56:38', '2026-02-04 17:00:02'),
(4, 6, NULL, 'mini project', 'i want ', 'auditoriam', '2026-02-16 18:30:00', '19:00:00', '20:00:00', 'rejected', NULL, '2026-02-06 06:53:46', '2026-02-18 17:59:00'),
(5, 15, NULL, 'dhol tasha', 'get prmission', 'shamiyana', '4993-01-30 18:30:00', '10:00:00', '11:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-11 12:00:47', '2026-02-11 12:00:47'),
(6, 15, NULL, 'dhol tasha', 'get prmission', 'shamiyana', '4993-01-30 18:30:00', '10:00:00', '11:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-11 12:00:50', '2026-02-11 12:00:50'),
(7, 15, NULL, 'dhol tasha', 'get prmission', 'shamiyana', '4993-01-30 18:30:00', '10:00:00', '11:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-11 12:03:40', '2026-02-11 12:03:40'),
(8, 15, 19, 'a', 'b', 'a', '2026-09-08 18:30:00', '06:30:00', '10:09:00', 'rejected', NULL, '2026-02-11 13:00:42', '2026-02-18 18:01:11'),
(9, 15, 19, 'a', 'a', 'a', '2026-12-23 18:30:00', '10:00:00', '12:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-11 13:35:20', '2026-02-11 13:35:20'),
(10, 15, 19, 'a', 'a', 'a', '2026-12-23 18:30:00', '10:00:00', '12:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-11 13:39:11', '2026-02-11 13:39:11'),
(11, 15, 19, 'uto', 'a', 'a', '2026-11-22 18:30:00', '10:00:00', '12:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-11 13:40:03', '2026-02-11 13:40:03'),
(12, 15, 19, 'a', 'a', 'auditoriam', '2027-12-22 18:30:00', '13:00:00', '15:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-11 13:40:48', '2026-02-11 13:40:48'),
(13, 15, 19, 'a', 'a', 'auditoriam', '2027-12-22 18:30:00', '13:00:00', '15:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-11 13:42:03', '2026-02-11 13:42:03'),
(14, 15, 19, 'a', 'a', 'auditoriam', '2027-12-22 18:30:00', '13:00:00', '15:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-11 13:42:06', '2026-02-11 13:42:06'),
(15, 15, 19, 'a', 'a', 'auditoriam', '2027-12-22 18:30:00', '13:00:00', '15:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-11 13:42:06', '2026-02-11 13:42:06'),
(16, 15, 19, 'a', 'a', 'auditoriam', '2027-12-22 18:30:00', '13:00:00', '15:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-11 13:42:06', '2026-02-11 13:42:06'),
(17, 15, 19, 'a', 'a', 'auditoriam', '2027-12-22 18:30:00', '13:00:00', '15:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-11 13:42:07', '2026-02-11 13:42:07'),
(18, 15, 19, 'a', 'a', 'auditoriam', '2027-12-22 18:30:00', '13:00:00', '15:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-11 13:42:07', '2026-02-11 13:42:07'),
(19, 15, 19, 'a', 'a', 'a', '2026-12-23 18:30:00', '08:00:00', '09:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-11 13:42:44', '2026-02-11 13:42:44'),
(20, 15, 19, 'na', 'na', 'a', '2026-12-09 18:30:00', '08:00:00', '10:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-13 06:01:11', '2026-02-13 06:01:11'),
(21, 15, 19, 'to get permission for an event', 'we are organising an event in our college so give me permission', 'a', '2026-12-09 18:30:00', '08:00:00', '10:00:00', 'pending_club_mentor', 'Club Mentor', '2026-02-13 06:01:52', '2026-02-13 06:01:52'),
(22, 15, 19, 'coding rounds', 'we are going to organize an event in our college', 'shamiyana', '2026-12-03 18:30:00', '10:00:00', '13:00:00', 'approved', NULL, '2026-02-13 06:08:36', '2026-02-13 06:11:51');

DROP TABLE IF EXISTS `principal_key`;
CREATE TABLE `principal_key` (
  `key_id` int NOT NULL AUTO_INCREMENT,
  `key_value` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`key_id`),
  UNIQUE KEY `key_value` (`key_value`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `principal_key` VALUES
(1, 'PRINCIPAL_KEY_2024', 1, '2026-02-04 11:38:56');

DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `role` VALUES
(4, 'Admin'),
(2, 'Club Head'),
(5, 'Club Mentor'),
(8, 'Director'),
(6, 'Estate Manager'),
(3, 'Faculty'),
(7, 'Principal'),
(1, 'Student');

DROP TABLE IF EXISTS `teacher_key`;
CREATE TABLE `teacher_key` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key_value` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_value` (`key_value`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `teacher_key` VALUES
(1, 'MASTERTEACHER2026');

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` int DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user` VALUES
(1, 'ram', 'ram2005@gmail.com', '$2b$10$B2qfHujBMm/iFYehheHFQeHhGazXYnQTgTeDPEHdbUDXFnHQ5HWaG', 'entc', 3, 1),
(3, 'don', 'don@gamil.com', '$2b$10$ZJT9LgWat9ik716hxhO1zOri9se6m9bKNuwNWFzdNX1fkeuh4jv/m', 'cs', 3, 1),
(4, 'jon', 'jon@gmail.com', '$2b$10$UYpGZ3dgOqlX3mPtbe0/su8/Ccld05FY0Cl8AKCgnYrMcYN5h3bzG', 'entc', 2, 1),
(6, 'CH', 'ch@gmail.com', '$2b$10$vR6gjgxWHlc22Ai5lLcseuH1Fn1qoqwkbjw8JlvWGRbZ0mDnsVsYK', 'entc', 4, 2),
(7, 'CM', 'cm@gmail.com', '$2b$10$QtTlHj63W5ZBgINc6NH8reGWfz.YYjMC2cYRfl.XKCyrYWx.Z3rbC', 'entc', NULL, 5),
(8, 'ES', 'es@gmail.com', '$2b$10$enkqZdR9vkBajaG0fMC8mOU3XMhAyJfZBs.Qrt6YjbbrsD8ME9jE.', '', NULL, 6),
(9, 'P', 'p@gmail.com', '$2b$10$C3o.pzeboRVhs8U2ru1XnO4o/LE7.nYveS58uEOL3gX/4GcwLyIPO', '', NULL, 7),
(10, 'D', 'd@gmail.com', '$2b$10$64vnzCEFGlPp2pZNjEpN2OQ1Q/BNdk0.PjmgrEXlterYQpBTBsYLC', '', NULL, 8),
(11, 'admin', 'ad@gmail.com', '$2b$10$0eLhTiogGEjPUJC.S1EI3eW.o5JWCA4TXyysTGfo7JvrfvKS3Umqa', 'cs', NULL, 4),
(12, 'nss head', 'nssh@gmail.com', '$2b$10$IsCD5boBPwPhgHN93zlAf.0ebkxi2Y/cFL0Wivy1dYhRTOw8MNVIe', 'entc', 1, 2),
(13, 'nss mentor', 'nssm@gmail.com', '$2b$10$BVuebU4/Fq6EtmlAptOifO2iYQM1qL1ho1NFvm5/uIwwk8opeLcHK', 'entc', NULL, 5),
(14, 'club mentor csi', 'cmcsi@gmail.com', '$2b$10$ICKAZXW8Z3dfpl.PPEjS4eYlv/KjjCMjRPFgJkySlWXVRzZh2BJAa', 'entc', NULL, 5),
(15, 'csi head', 'chcsi@gamil.com', '$2b$10$zVdnXimazXTZYs8uxMyfD.gi5MzukvYYq5mXwC4u2UoteSzKcvlA2', 'entc', 2, 2),
(16, 'Test Student', 'testuser1770721564129@pict.edu', '$2b$10$VvjcqEgY59GRYoslR6zhS.IXOWtpULMK.pJ8ztU5pwP3r.m09/URG', NULL, NULL, 1),
(17, 'Test Student', 'testuser1770721693388@pict.edu', '$2b$10$NA3bYunbMe21QCbHugHs4.1aCORgubE08DAZhjM7HWJpH/vcWIMNq', NULL, NULL, 1),
(18, 'raju', 'raju@gmail.com', '$2b$10$v/.CP.TKTtccUG8PtgtPgOhzdpK8pCQjTZkEhLKC9XCz3tGVKPnZW', 'entc', 2, 1),
(19, 'kaju', 'kaju@gmail.com', '$2b$10$q3tuI631GqOwakZgQqsBXOJcMGyreCRaxGS8pCylR0LqUqiA4rSWq', 'entc', 2, 1),
(20, 'ladu', 'ladu@gmail.com', '$2b$10$h55bPQ9CyO8IqAujEQ2aW.Sf4pY6XKTrWAz0PLW0pPaqXOoQoBm4K', 'entc', 1, 1),
(21, 'spider man', 'chaws@gmail.com', '$2b$10$HMwqS8e.iT3qHESY9t/M2O3Rjx1rKyYn.PMZ89G6y0cCqtcT6zNvq', 'entc', 2, 2),
(22, 'super man', 'cmaws@gmail.com', '$2b$10$vzJv34GzhtQ6Yn6Hkgmu2ONCJ3DH/9qE7gnIjz7pDgVZ2GAExdDu.', 'entc', NULL, 5),
(23, 'hruta', 'hruta@gmail.com', '$2b$10$f2kFXypWsT6LymzRGNN9reg.DZyLrr1sbElN.l6YV9c8qRuZuUUA6', 'entc', 1, 1);

DROP TABLE IF EXISTS `volunteer`;
CREATE TABLE `volunteer` (
  `volunteer_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `student_id` int NOT NULL,
  `task` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attendance` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`volunteer_id`),
  UNIQUE KEY `unique_volunteer` (`event_id`,`student_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `volunteer_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `volunteer_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS=1;
