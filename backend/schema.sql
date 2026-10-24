-- ===================================================================
-- MediCare+ Database Schema (MySQL / SQL)
-- ===================================================================

CREATE DATABASE IF NOT EXISTS `medicare_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `medicare_db`;

DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `patient_assigned_videos`;
DROP TABLE IF EXISTS `medicine_adherence`;
DROP TABLE IF EXISTS `progress_logs`;
DROP TABLE IF EXISTS `chat_messages`;
DROP TABLE IF EXISTS `appointments`;
DROP TABLE IF EXISTS `medical_reports`;
DROP TABLE IF EXISTS `medicines`;
DROP TABLE IF EXISTS `health_videos`;
DROP TABLE IF EXISTS `doctors`;
DROP TABLE IF EXISTS `admins`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `patient_id` VARCHAR(50) NOT NULL UNIQUE,
    `full_name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `phone` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'patient',
    `age` INT DEFAULT 28,
    `gender` VARCHAR(20) DEFAULT 'Male',
    `blood_group` VARCHAR(10) DEFAULT 'B+',
    `address` VARCHAR(255) DEFAULT 'Pune, Maharashtra',
    `emergency_contact` VARCHAR(100) DEFAULT '+91 98765 00000',
    `chronic_conditions` VARCHAR(255) DEFAULT 'None recorded',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `doctors` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL DEFAULT 'doctor123',
    `role` VARCHAR(50) NOT NULL DEFAULT 'doctor',
    `specialization` VARCHAR(150) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Online',
    `avatar_initials` VARCHAR(10) NOT NULL,
    `phone` VARCHAR(50) DEFAULT '+91 98111 22334',
    `qualification` VARCHAR(100) DEFAULT 'MBBS, MD',
    `experience` VARCHAR(50) DEFAULT '12 Years',
    `bio` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `admins` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL DEFAULT 'admin123',
    `role` VARCHAR(50) NOT NULL DEFAULT 'admin',
    `phone` VARCHAR(50) NOT NULL,
    `designation` VARCHAR(150) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `medicines` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `dose` VARCHAR(150) NOT NULL,
    `reminder_time` VARCHAR(50) NOT NULL,
    `reminder_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `prescribed_by` VARCHAR(150) DEFAULT 'Dr. Priya Sharma',
    `instructions` VARCHAR(255) DEFAULT 'Take as directed',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_medicines_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `medicine_adherence` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `medicine_id` BIGINT NOT NULL,
    `medicine_name` VARCHAR(150) NOT NULL,
    `dose` VARCHAR(150) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `action_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `notes` VARCHAR(255) DEFAULT NULL,
    CONSTRAINT `fk_adherence_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `medical_reports` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `report_name` VARCHAR(200) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `report_date` VARCHAR(50) NOT NULL,
    `doctor_or_lab` VARCHAR(150) DEFAULT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Reviewed',
    `file_name` VARCHAR(255) DEFAULT NULL,
    `file_path` VARCHAR(255) DEFAULT NULL,
    `file_size` VARCHAR(50) DEFAULT NULL,
    `notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_reports_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `appointments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `patient_name` VARCHAR(150) NOT NULL,
    `doctor_id` BIGINT NOT NULL,
    `doctor_name` VARCHAR(150) NOT NULL,
    `appointment_date` VARCHAR(50) NOT NULL,
    `time_slot` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Confirmed',
    `notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_appointments_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `chat_messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `patient_name` VARCHAR(150) NOT NULL,
    `doctor_id` BIGINT NOT NULL,
    `doctor_name` VARCHAR(150) NOT NULL,
    `sender` VARCHAR(50) NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_chat_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `health_videos` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `duration` VARCHAR(50) NOT NULL,
    `tag` VARCHAR(100) NOT NULL DEFAULT 'Health education',
    `icon` VARCHAR(20) NOT NULL,
    `is_ai` BOOLEAN NOT NULL DEFAULT FALSE,
    `summary` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `notifications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `medicine_id` BIGINT DEFAULT NULL,
    `medicine_name` VARCHAR(150) DEFAULT NULL,
    `dose` VARCHAR(150) DEFAULT NULL,
    `title` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `action_status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `progress_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `log_date` VARCHAR(50) NOT NULL,
    `weight_kg` DOUBLE NOT NULL,
    `feeling` VARCHAR(100) NOT NULL,
    `medicines_taken` VARCHAR(100) DEFAULT '4 of 4 planned',
    `water_intake` VARCHAR(100) DEFAULT '2.5 litres',
    `exercise_minutes` INT DEFAULT 30,
    `steps_today` INT DEFAULT 8000,
    `blood_pressure` VARCHAR(50) DEFAULT '120/80',
    `hemoglobin` DOUBLE DEFAULT 13.8,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
