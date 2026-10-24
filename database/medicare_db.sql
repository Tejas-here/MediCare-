-- ===================================================================
-- MediCare+ Full Database Script (MySQL / SQL)
-- Contains: Schema Creation + Table Definitions + Initial Seed Data
-- Enhanced with: Doctor Modules, Medicine Adherence, Admin Analytics, AI Videos
-- ===================================================================

CREATE DATABASE IF NOT EXISTS `medicare_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `medicare_db`;

-- Drop old tables if re-initializing
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

-- -------------------------------------------------------------------
-- 1. Table: users (Patients & Authentication)
-- -------------------------------------------------------------------
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

INSERT INTO `users` (`id`, `patient_id`, `full_name`, `email`, `phone`, `password`, `role`, `age`, `gender`, `blood_group`, `address`, `emergency_contact`, `chronic_conditions`) VALUES
(1, 'MED-1001', 'Avishkar', 'avishkar@example.com', '+91 98765 43210', 'password123', 'patient', 28, 'Male', 'B+', 'Flat 402, Green Avenue, Pune', '+91 98765 00000 (Brother)', 'Mild Seasonal Allergies'),
(2, 'MED-8500', 'Rahul Sharma', 'rahul.sharma@example.com', '+91 91234 56789', 'password123', 'patient', 45, 'Male', 'O+', 'Plot 12, Baner Road, Pune', '+91 91234 11111 (Wife)', 'Type 2 Diabetes, Hypertension'),
(3, 'MED-4210', 'Ananya Verma', 'ananya.verma@example.com', '+91 97654 32109', 'password123', 'patient', 32, 'Female', 'A+', '15 Lotus Towers, Viman Nagar, Pune', '+91 97654 00000 (Mother)', 'Asthma, Iron Deficiency'),
(4, 'MED-6102', 'Suresh Patil', 'suresh.patil@example.com', '+91 98220 12345', 'password123', 'patient', 58, 'Male', 'AB+', '22 Shivaji Society, Kothrud, Pune', '+91 98220 99999 (Son)', 'Post-Cardiac Angioplasty recovery');

-- -------------------------------------------------------------------
-- 2. Table: doctors
-- -------------------------------------------------------------------
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

INSERT INTO `doctors` (`id`, `name`, `email`, `password`, `role`, `specialization`, `status`, `avatar_initials`, `phone`, `qualification`, `experience`, `bio`) VALUES
(1, 'Dr. Priya Sharma', 'dr.priya@medicare.com', 'doctor123', 'doctor', 'General Physician & Internal Medicine', 'Online', 'PS', '+91 98111 22334', 'MBBS, MD (Medicine)', '12 Years', 'Senior Consultant Physician specializing in lifestyle disease management and preventive care.'),
(2, 'Dr. Amit Patel', 'dr.amit@medicare.com', 'doctor123', 'doctor', 'Cardiologist', 'Offline', 'AM', '+91 98222 33445', 'MBBS, DM (Cardiology)', '16 Years', 'Interventional Cardiologist focused on coronary artery disease and heart health optimization.'),
(3, 'Dr. Sneha Kulkarni', 'dr.sneha@medicare.com', 'doctor123', 'doctor', 'Gynecologist', 'Online', 'SK', '+91 98333 44556', 'MBBS, MS (OBGYN)', '9 Years', 'Specialist in women healthcare, prenatal nutrition, and endocrine balance.');

-- -------------------------------------------------------------------
-- 3. Table: admins
-- -------------------------------------------------------------------
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

INSERT INTO `admins` (`id`, `full_name`, `email`, `password`, `role`, `phone`, `designation`) VALUES
(1, 'Super Administrator', 'admin@medicare.com', 'admin123', 'admin', '+91 90000 00000', 'Chief Health Informatics Officer');

-- -------------------------------------------------------------------
-- 4. Table: medicines (Prescriptions & Reminders)
-- -------------------------------------------------------------------
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

INSERT INTO `medicines` (`id`, `user_id`, `name`, `dose`, `reminder_time`, `reminder_active`, `prescribed_by`, `instructions`) VALUES
(1, 1, 'Paracetamol 500mg', '1 tablet after food', '08:00 AM', 1, 'Dr. Priya Sharma', 'Take post breakfast with water'),
(2, 1, 'Vitamin D3 60k', '1 tablet (weekly once)', '09:00 AM', 1, 'Dr. Priya Sharma', 'Take after morning meal'),
(3, 1, 'Iron Complex', '1 tablet after lunch', '01:00 PM', 1, 'Dr. Sneha Kulkarni', 'Take after afternoon meal'),
(4, 1, 'Calcium Tablet', '1 tablet at bedtime', '08:00 PM', 1, 'Dr. Priya Sharma', 'Take with warm milk or water'),
(5, 2, 'Metformin 500mg', '1 tablet after dinner', '09:00 PM', 1, 'Dr. Priya Sharma', 'Control blood sugar levels'),
(6, 2, 'Telmisartan 40mg', '1 tablet empty stomach', '07:30 AM', 1, 'Dr. Amit Patel', 'Manage resting BP'),
(7, 3, 'Levocetirizine 5mg', '1 tablet before sleep', '10:00 PM', 1, 'Dr. Priya Sharma', 'Allergy relief'),
(8, 4, 'Aspirin 75mg', '1 tablet post breakfast', '08:30 AM', 1, 'Dr. Amit Patel', 'Blood thinner support'),
(9, 4, 'Atorvastatin 20mg', '1 tablet post dinner', '09:30 PM', 1, 'Dr. Amit Patel', 'Lipid lowering agent');

-- -------------------------------------------------------------------
-- 5. Table: medicine_adherence (Patient Adherence Tracking)
-- -------------------------------------------------------------------
CREATE TABLE `medicine_adherence` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `medicine_id` BIGINT NOT NULL,
    `medicine_name` VARCHAR(150) NOT NULL,
    `dose` VARCHAR(150) NOT NULL,
    `status` VARCHAR(50) NOT NULL, -- 'Eaten' or 'Not Eaten'
    `action_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `notes` VARCHAR(255) DEFAULT NULL,
    CONSTRAINT `fk_adherence_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `medicine_adherence` (`id`, `user_id`, `medicine_id`, `medicine_name`, `dose`, `status`, `action_time`, `notes`) VALUES
(1, 1, 1, 'Paracetamol 500mg', '1 tablet after food', 'Eaten', '2026-10-23 08:15:00', 'Taken on time'),
(2, 1, 2, 'Vitamin D3 60k', '1 tablet', 'Eaten', '2026-10-23 09:05:00', 'Taken with breakfast'),
(3, 1, 3, 'Iron Complex', '1 tablet after lunch', 'Not Eaten', '2026-10-23 13:40:00', 'Patient had nausea, postponed');

-- -------------------------------------------------------------------
-- 6. Table: medical_reports (Reports & Document metadata)
-- -------------------------------------------------------------------
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

INSERT INTO `medical_reports` (`id`, `user_id`, `report_name`, `category`, `report_date`, `doctor_or_lab`, `status`, `file_name`, `file_size`, `notes`) VALUES
(1, 1, 'Complete Blood Count (CBC) & Lipid Profile', 'Blood Test', '12 Sep 2026', 'City Diagnostic Centre', 'Reviewed', 'cbc-lipid-profile.pdf', '1.2 MB', 'Hemoglobin 13.8 g/dL (Normal). Fasting Blood Sugar 94 mg/dL (Optimal). Total Cholesterol 178 mg/dL.'),
(2, 1, 'Chest Digital X-Ray (PA View)', 'X-Ray', '01 Aug 2026', 'Metro Advanced Imaging Lab', 'Reviewed', 'chest-xray-digital.pdf', '2.4 MB', 'Bilateral lung fields clear. Normal bronchovascular markings. Normal cardiac silhouette.'),
(3, 1, '12-Lead Electrocardiogram (ECG)', 'ECG', '15 Jul 2026', 'Dr. Amit Patel (Cardiology Clinic)', 'Reviewed', 'ecg-evaluation-report.pdf', '840 KB', 'Normal sinus rhythm at 72 bpm. PR interval 150 ms, QRS duration 86 ms.'),
(4, 1, 'Medical Prescription & Health Regimen', 'Prescription', '10 Jul 2026', 'Dr. Priya Sharma', 'Reviewed', 'prescription-july2026.pdf', '540 KB', 'Follow-up prescription for seasonal allergy care, hydration regimen, and nutritional vitamin supplements.'),
(5, 2, 'HbA1c Glycated Hemoglobin Test', 'Blood Test', '18 Oct 2026', 'City Diagnostic Centre', 'Reviewed', 'hba1c-report.pdf', '1.1 MB', 'HbA1c: 6.8% (Fair diabetic control). Serum Creatinine 0.9 mg/dL.'),
(6, 4, 'Post-Angioplasty Echocardiogram 2D', 'ECG', '20 Oct 2026', 'Life Care Heart Institute', 'Pending', '2d-echo-cardio.pdf', '3.1 MB', 'Left ventricular ejection fraction (LVEF) 55%. Normal chamber dimensions.');

-- -------------------------------------------------------------------
-- 7. Table: appointments
-- -------------------------------------------------------------------
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

INSERT INTO `appointments` (`id`, `user_id`, `patient_name`, `doctor_id`, `doctor_name`, `appointment_date`, `time_slot`, `status`, `notes`) VALUES
(1, 1, 'Avishkar', 1, 'Dr. Priya Sharma', '2026-10-25', '10:30 AM', 'Confirmed', 'Routine health checkup & review'),
(2, 1, 'Avishkar', 2, 'Dr. Amit Patel', '2026-10-28', '11:30 AM', 'Confirmed', 'Cardiac routine consultation'),
(3, 2, 'Rahul Sharma', 1, 'Dr. Priya Sharma', '2026-10-26', '02:00 PM', 'Confirmed', 'Diabetes checkup'),
(4, 3, 'Ananya Verma', 3, 'Dr. Sneha Kulkarni', '2026-10-27', '04:30 PM', 'Pending', 'Women health and vitamins check'),
(5, 4, 'Suresh Patil', 2, 'Dr. Amit Patel', '2026-10-29', '10:00 AM', 'Confirmed', 'Post-angioplasty 3-month follow-up');

-- -------------------------------------------------------------------
-- 8. Table: chat_messages (Doctor - Patient Chat)
-- -------------------------------------------------------------------
CREATE TABLE `chat_messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `patient_name` VARCHAR(150) NOT NULL,
    `doctor_id` BIGINT NOT NULL,
    `doctor_name` VARCHAR(150) NOT NULL,
    `sender` VARCHAR(50) NOT NULL, -- 'patient' or 'doctor'
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_chat_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `chat_messages` (`id`, `user_id`, `patient_name`, `doctor_id`, `doctor_name`, `sender`, `message`, `created_at`) VALUES
(1, 1, 'Avishkar', 1, 'Dr. Priya Sharma', 'doctor', 'Hello Avishkar! How are you feeling after starting the new vitamin supplement?', '2026-10-22 09:00:00'),
(2, 1, 'Avishkar', 1, 'Dr. Priya Sharma', 'patient', 'Hello Doctor Priya! I am feeling much better and more energetic today.', '2026-10-22 09:05:00'),
(3, 1, 'Avishkar', 1, 'Dr. Priya Sharma', 'doctor', 'Excellent! Keep taking it with food and maintain your 2.5 litres daily water intake.', '2026-10-22 09:12:00'),
(4, 2, 'Rahul Sharma', 1, 'Dr. Priya Sharma', 'patient', 'Doctor, my fasting sugar was 110 mg/dL this morning. Should I adjust Metformin?', '2026-10-23 08:30:00'),
(5, 2, 'Rahul Sharma', 1, 'Dr. Priya Sharma', 'doctor', '110 mg/dL is within our targeted range Rahul. Continue your current dosage.', '2026-10-23 09:10:00');

-- -------------------------------------------------------------------
-- 9. Table: health_videos (Instruction & AI Videos)
-- -------------------------------------------------------------------
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

INSERT INTO `health_videos` (`id`, `title`, `category`, `duration`, `tag`, `icon`, `is_ai`, `summary`) VALUES
(1, 'AI Clinical Guide: Understanding Blood Tests & Vital Signs', 'AI Guidance', '06:45 min', 'AI Medical Explainer', '🤖', TRUE, 'AI Doctor explains what Hemoglobin, White Blood Cells, Platelets, and Fasting Blood Glucose mean for your daily energy and immune system.'),
(2, 'AI Health Assistant: Proper Medicine Routine & Adherence', 'AI Guidance', '05:10 min', 'AI Prescription Safety', '💊', TRUE, 'Interactive AI guidance on how food affects tablet absorption, the danger of skipping doses, and setting smart notification routines.'),
(3, 'AI Nutritionist: Personalized Heart & Diabetic Diet Protocol', 'AI Guidance', '08:20 min', 'AI Nutrition Advice', '🥗', TRUE, 'Smart AI dietician breaks down balanced carbohydrate intake, low sodium seasoning, high fiber legumes, and optimal hydration.'),
(4, 'AI Physiotherapist: Post-Surgery Breathing & Mobility', 'AI Guidance', '07:15 min', 'AI Rehabilitation', '🧘', TRUE, 'Step-by-step guided diaphragmatic breathing and gentle thoracic expansion exercises for post-operative recovery.'),
(5, 'How to take medicines correctly and safely', 'Medicine Usage', '05:30 min', 'Health Education', '💊', FALSE, 'Standard clinical guidance on reading prescription labels, storing medicines at room temperature, and using pill organizers.'),
(6, 'Breathing Exercises for Better Heart Health', 'Exercise', '07:12 min', 'Health Education', '🫁', FALSE, 'Calming pranayama and rhythmic cardiovascular breathing routines to reduce stress and stabilize resting blood pressure.'),
(7, 'Healthy Diet Plan for Busy Professionals', 'Diet & Nutrition', '06:20 min', 'Health Education', '🥗', FALSE, 'Easy meal prepping tips, quick healthy breakfast ideas, and managing afternoon energy crashes.'),
(8, 'Diabetes Daily Care & Blood Sugar Tracking', 'General Health', '08:10 min', 'Health Education', '🩸', FALSE, 'Guide to using glucometers correctly, preventing hypoglycemia, and foot care for diabetic individuals.');

-- -------------------------------------------------------------------
-- 10. Table: notifications (Medicine Reminders with Eaten/Not Eaten & System Alerts)
-- -------------------------------------------------------------------
CREATE TABLE `notifications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `type` VARCHAR(50) NOT NULL, -- 'medicine', 'appointment', 'video', 'report', 'system'
    `medicine_id` BIGINT DEFAULT NULL,
    `medicine_name` VARCHAR(150) DEFAULT NULL,
    `dose` VARCHAR(150) DEFAULT NULL,
    `title` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `action_status` VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'eaten', 'not_eaten', 'read'
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `notifications` (`id`, `user_id`, `type`, `medicine_id`, `medicine_name`, `dose`, `title`, `message`, `action_status`, `created_at`) VALUES
(1, 1, 'medicine', 1, 'Paracetamol 500mg', '1 tablet after food', 'Time for your Medicine!', 'Please take Paracetamol 500mg (1 tablet after food) now.', 'pending', '2026-10-23 20:00:00'),
(2, 1, 'medicine', 4, 'Calcium Tablet', '1 tablet at bedtime', 'Night Medicine Reminder', 'Time to take Calcium Tablet (1 tablet at bedtime).', 'pending', '2026-10-23 20:30:00'),
(3, 1, 'appointment', NULL, NULL, NULL, 'Upcoming Doctor Consultation', 'Appointment confirmed with Dr. Priya Sharma on 25 Oct 2026 at 10:30 AM.', 'read', '2026-10-23 15:00:00'),
(4, 1, 'video', NULL, NULL, NULL, 'New Educational Video Prescribed', 'Dr. Priya Sharma assigned you: "AI Clinical Guide: Understanding Blood Tests".', 'read', '2026-10-23 16:20:00'),
(5, 1, 'report', NULL, NULL, NULL, 'Medical Report Verified', 'Your Complete Blood Count report has been reviewed and signed by Dr. Priya Sharma.', 'read', '2026-10-23 14:10:00');

-- -------------------------------------------------------------------
-- 11. Table: progress_logs (Daily Metrics & Weight Logs)
-- -------------------------------------------------------------------
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

INSERT INTO `progress_logs` (`id`, `user_id`, `log_date`, `weight_kg`, `feeling`, `medicines_taken`, `water_intake`, `exercise_minutes`, `steps_today`, `blood_pressure`, `hemoglobin`) VALUES
(1, 1, '2026-10-18', 72.8, 'Good', '4 of 4 planned', '2.5 litres', 30, 8200, '122/82', 13.8),
(2, 1, '2026-10-20', 72.2, 'Energetic', '4 of 4 planned', '3.0 litres', 40, 9500, '120/80', 13.8),
(3, 1, '2026-10-22', 71.8, 'Good', '3 of 4 planned', '2.8 litres', 35, 8700, '118/78', 13.8),
(4, 1, '2026-10-23', 71.5, 'Excellent', '4 of 4 planned', '3.0 litres', 45, 10200, '119/79', 13.8),
(5, 2, '2026-10-22', 84.0, 'Fair', '2 of 2 planned', '2.0 litres', 20, 6000, '135/88', 14.1);

-- ===================================================================
-- End of MediCare+ Database Script
-- ===================================================================
