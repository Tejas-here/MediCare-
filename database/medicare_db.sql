-- ===================================================================
-- MediCare+ Full Database Script (MySQL / SQL)
-- Contains: Schema Creation + Table Definitions + Initial Seed Data
-- ===================================================================

CREATE DATABASE IF NOT EXISTS `medicare_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `medicare_db`;

-- -------------------------------------------------------------------
-- 1. Table: users (Patients & Authentication)
-- -------------------------------------------------------------------
DROP TABLE IF EXISTS `progress_logs`;
DROP TABLE IF EXISTS `chat_messages`;
DROP TABLE IF EXISTS `appointments`;
DROP TABLE IF EXISTS `medical_reports`;
DROP TABLE IF EXISTS `medicines`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `patient_id` VARCHAR(50) NOT NULL UNIQUE,
    `full_name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `phone` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `patient_id`, `full_name`, `email`, `phone`, `password`) VALUES
(1, 'MED-1001', 'Avishkar', 'avishkar@example.com', '+91 98765 43210', '$2a$10$7AhfYGVNGtMnKtDGo5RfZeCXy6ZlBeIktRgLPmU1Ps2sD67yStw2y'),
(2, 'MED-8500', 'Rahul Sharma', 'rahul.sharma@example.com', '+91 91234 56789', '$2a$10$wE9oWvhFz6V7KjYQ/R0gQ.3VqM6Wcbnj9E18yPZk2XzUeF1j1lK7y');

-- -------------------------------------------------------------------
-- 2. Table: doctors
-- -------------------------------------------------------------------
DROP TABLE IF EXISTS `doctors`;

CREATE TABLE `doctors` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `specialization` VARCHAR(150) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Online',
    `avatar_initials` VARCHAR(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `doctors` (`id`, `name`, `specialization`, `status`, `avatar_initials`) VALUES
(1, 'Dr. Priya Sharma', 'General Physician', 'Online', 'PS'),
(2, 'Dr. Amit Patel', 'Cardiologist', 'Offline', 'AM'),
(3, 'Dr. Sneha Kulkarni', 'Gynecologist', 'Online', 'SK');

-- -------------------------------------------------------------------
-- 3. Table: medicines (Prescriptions & Reminders)
-- -------------------------------------------------------------------
CREATE TABLE `medicines` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NULL,
    `name` VARCHAR(150) NOT NULL,
    `dose` VARCHAR(150) NOT NULL,
    `reminder_time` VARCHAR(50) NOT NULL,
    `reminder_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_medicines_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `medicines` (`id`, `user_id`, `name`, `dose`, `reminder_time`, `reminder_active`) VALUES
(1, 1, 'Paracetamol 500mg', '1 tablet after food', '08:00 AM', 1),
(2, 1, 'Vitamin D3', '1 tablet (once daily)', '09:00 AM', 1),
(3, 1, 'Iron Tablet', '1 tablet after food', '01:00 PM', 1),
(4, 1, 'Calcium Tablet', '1 tablet at night', '08:00 PM', 1),
(5, 1, 'Metformin 500mg', '1 tablet after dinner', '09:00 PM', 0);

-- -------------------------------------------------------------------
-- 4. Table: medical_reports (Reports & Document metadata)
-- -------------------------------------------------------------------
CREATE TABLE `medical_reports` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NULL,
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

INSERT INTO `medical_reports` (`id`, `user_id`, `report_name`, `category`, `report_date`, `doctor_or_lab`, `status`, `file_name`, `file_size`, `notes`) VALUES
(1, 1, 'Blood Test Report', 'Blood Test', '12 Sep 2026', 'City Diagnostic Lab', 'Reviewed', 'blood-test.pdf', '1.2 MB', 'Routine complete blood count and lipid panel within normal limits.'),
(2, 1, 'X-Ray (Chest)', 'X-Ray', '01 Aug 2026', 'Metro Imaging Centre', 'Reviewed', 'chest-xray.jpg', '2.4 MB', 'Chest X-ray clear, normal cardiothoracic ratio.'),
(3, 1, 'ECG Report', 'ECG', '15 Jul 2026', 'Dr. Mehta', 'Reviewed', 'ecg-report.pdf', '840 KB', 'Normal sinus rhythm at 72 bpm.'),
(4, 1, 'Prescription', 'Prescription', '10 Jul 2026', 'Dr. Mehta', 'Pending', 'prescription.pdf', '540 KB', 'Prescription for seasonal allergies and vitamins.');

-- -------------------------------------------------------------------
-- 5. Table: appointments
-- -------------------------------------------------------------------
CREATE TABLE `appointments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NULL,
    `doctor_name` VARCHAR(150) NOT NULL,
    `appointment_date` VARCHAR(50) NOT NULL,
    `time_slot` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Confirmed',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_appointments_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `appointments` (`id`, `user_id`, `doctor_name`, `appointment_date`, `time_slot`, `status`) VALUES
(1, 1, 'Dr. Amit Patel', '2026-10-25', '11:30 AM', 'Confirmed');

-- -------------------------------------------------------------------
-- 6. Table: chat_messages (Doctor - Patient Chat)
-- -------------------------------------------------------------------
CREATE TABLE `chat_messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NULL,
    `sender` VARCHAR(50) NOT NULL,
    `doctor_name` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_chat_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `chat_messages` (`id`, `user_id`, `sender`, `doctor_name`, `message`) VALUES
(1, 1, 'doctor', 'Dr. Priya Sharma', 'Hello Avishkar, how are you feeling today?'),
(2, 1, 'patient', 'Dr. Priya Sharma', 'Hello Doctor. I have a question about my medicine.'),
(3, 1, 'patient', 'Dr. Priya Sharma', 'Doctor, can I take the medicine before food?');

-- -------------------------------------------------------------------
-- 7. Table: medical_services (Nearby Hospitals & Labs)
-- -------------------------------------------------------------------
DROP TABLE IF EXISTS `medical_services`;

CREATE TABLE `medical_services` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `service_type` VARCHAR(100) NOT NULL,
    `distance` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `medical_services` (`id`, `name`, `service_type`, `distance`, `phone`, `address`, `icon`) VALUES
(1, 'City Care Hospital', 'Hospital', '2.1 km', '+91 20 5550 0100', 'Multispecialty Healthcare Centre, Main St', '🏥'),
(2, 'Shree Medical Store', 'Medical Store', '1.5 km', '+91 20 5550 0101', 'Near College Road, Market Yard', '💊'),
(3, 'ABC Diagnostic Lab', 'Diagnostic Lab', '2.5 km', '+91 20 5550 0102', 'Pathology & Blood Tests Centre, Station Road', '🧪'),
(4, 'Life Care Hospital', 'Hospital', '3.0 km', '+91 20 5550 0103', 'General & Emergency Hospital, Ring Road', '🏥');

-- -------------------------------------------------------------------
-- 8. Table: health_videos (Instruction & Guidance Videos)
-- -------------------------------------------------------------------
DROP TABLE IF EXISTS `health_videos`;

CREATE TABLE `health_videos` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `duration` VARCHAR(50) NOT NULL,
    `tag` VARCHAR(100) NOT NULL DEFAULT 'Health education',
    `video_url` VARCHAR(255) DEFAULT NULL,
    `icon` VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `health_videos` (`id`, `title`, `category`, `duration`, `tag`, `video_url`, `icon`) VALUES
(1, 'How to take medicines correctly', 'Medicine Usage', '05:30 min', 'Health education', NULL, '💊'),
(2, 'Breathing Exercises for Better Health', 'Exercise', '07:12 min', 'Health education', NULL, '🧘'),
(3, 'Healthy Diet Plan', 'Diet & Nutrition', '06:20 min', 'Health education', NULL, '🥗'),
(4, 'Post-Surgery Care Tips', 'General Health', '04:15 min', 'Health education', NULL, '🛏️'),
(5, 'Diabetes Care Guide', 'General Health', '08:10 min', 'Health education', NULL, '🩸'),
(6, 'Women\'s Health Tips', 'General Health', '07:25 min', 'Health education', NULL, '👩‍⚕️');

-- -------------------------------------------------------------------
-- 9. Table: progress_logs (Daily Metrics & Weight Logs)
-- -------------------------------------------------------------------
CREATE TABLE `progress_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NULL,
    `log_date` VARCHAR(50) NOT NULL,
    `weight_kg` DOUBLE NOT NULL,
    `feeling` VARCHAR(100) NOT NULL,
    `medicines_taken` VARCHAR(100) DEFAULT '3 of 3 planned',
    `water_intake` VARCHAR(100) DEFAULT '2.5 litres',
    `exercise_minutes` INT DEFAULT 30,
    `steps_today` INT DEFAULT 8000,
    `blood_pressure` VARCHAR(50) DEFAULT '120/80',
    `hemoglobin` DOUBLE DEFAULT 11.2,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `progress_logs` (`id`, `user_id`, `log_date`, `weight_kg`, `feeling`, `medicines_taken`, `water_intake`, `exercise_minutes`, `steps_today`, `blood_pressure`, `hemoglobin`) VALUES
(1, 1, '2026-10-12', 72.0, 'Good', '3 of 3 planned', '2.5 litres', 30, 8000, '120/80', 11.2),
(2, 1, '2026-10-22', 71.5, 'Good', '3 of 3 planned', '2.5 litres', 30, 8000, '120/80', 11.2);
