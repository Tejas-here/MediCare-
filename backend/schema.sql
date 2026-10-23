-- ===================================================================
-- MediCare+ Healthcare Platform Database Schema (MySQL / SQL)
-- Database Name: medicare_db
-- ===================================================================

CREATE DATABASE IF NOT EXISTS medicare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE medicare_db;

-- 1. Users / Patients Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    specialization VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Online',
    avatar_initials VARCHAR(10) NOT NULL
);

-- 3. Medicines & Reminders Table
CREATE TABLE IF NOT EXISTS medicines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    name VARCHAR(150) NOT NULL,
    dose VARCHAR(150) NOT NULL,
    reminder_time VARCHAR(50) NOT NULL,
    reminder_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_medicine_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Medical Reports Table
CREATE TABLE IF NOT EXISTS medical_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    report_name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    report_date VARCHAR(50) NOT NULL,
    doctor_or_lab VARCHAR(150),
    status VARCHAR(50) NOT NULL DEFAULT 'Reviewed',
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    file_size VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_report_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    doctor_name VARCHAR(150) NOT NULL,
    appointment_date VARCHAR(50) NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Doctor Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    sender VARCHAR(50) NOT NULL, -- 'patient' or 'doctor'
    doctor_name VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Nearby Medical Services Table
CREATE TABLE IF NOT EXISTS medical_services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    service_type VARCHAR(100) NOT NULL, -- 'Hospital', 'Medical Store', 'Diagnostic Lab'
    distance VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    icon VARCHAR(20) NOT NULL
);

-- 8. Instruction Videos Table
CREATE TABLE IF NOT EXISTS health_videos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Medicine Usage', 'Exercise', 'Diet & Nutrition', 'General Health'
    duration VARCHAR(50) NOT NULL,
    tag VARCHAR(100) NOT NULL DEFAULT 'Health education',
    video_url VARCHAR(255),
    icon VARCHAR(20) NOT NULL
);

-- 9. Progress Tracking & Daily Health Logs Table
CREATE TABLE IF NOT EXISTS progress_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    log_date VARCHAR(50) NOT NULL,
    weight_kg DOUBLE NOT NULL,
    feeling VARCHAR(100) NOT NULL,
    medicines_taken VARCHAR(100) DEFAULT '3 of 3 planned',
    water_intake VARCHAR(100) DEFAULT '2.5 litres',
    exercise_minutes INT DEFAULT 30,
    steps_today INT DEFAULT 8000,
    blood_pressure VARCHAR(50) DEFAULT '120/80',
    hemoglobin DOUBLE DEFAULT 11.2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
