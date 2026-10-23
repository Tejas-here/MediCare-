-- ===================================================================
-- MediCare+ Healthcare Platform Initial Seed Data (SQL)
-- ===================================================================

USE medicare_db;

-- Initial Demo Patient
INSERT INTO users (id, patient_id, full_name, email, phone, password)
VALUES (1, 'MED-1001', 'Avishkar', 'avishkar@example.com', '+91 98765 43210', '$2a$10$e8V9g1yZc0E8W4eBfC2iVe9d3bF6g1a8Z4d2c8f6e4a2b0d8c6f4a')
ON DUPLICATE KEY UPDATE id=id;

-- Initial Doctors
INSERT INTO doctors (id, name, specialization, status, avatar_initials) VALUES
(1, 'Dr. Priya Sharma', 'General Physician', 'Online', 'PS'),
(2, 'Dr. Amit Patel', 'Cardiologist', 'Offline', 'AM'),
(3, 'Dr. Sneha Kulkarni', 'Gynecologist', 'Online', 'SK')
ON DUPLICATE KEY UPDATE id=id;

-- Initial Medicines
INSERT INTO medicines (id, user_id, name, dose, reminder_time, reminder_active) VALUES
(1, 1, 'Paracetamol 500mg', '1 tablet after food', '08:00 AM', true),
(2, 1, 'Vitamin D3', '1 tablet (once daily)', '09:00 AM', true),
(3, 1, 'Iron Tablet', '1 tablet after food', '01:00 PM', true),
(4, 1, 'Calcium Tablet', '1 tablet at night', '08:00 PM', true)
ON DUPLICATE KEY UPDATE id=id;

-- Initial Medical Reports
INSERT INTO medical_reports (id, user_id, report_name, category, report_date, doctor_or_lab, status, file_name, file_size, notes) VALUES
(1, 1, 'Blood Test Report', 'Blood Test', '12 Sep 2026', 'City Diagnostic Lab', 'Reviewed', 'blood-test.pdf', '1.2 MB', 'Routine complete blood count.'),
(2, 1, 'X-Ray (Chest)', 'X-Ray', '01 Aug 2026', 'Metro Imaging Centre', 'Reviewed', 'chest-xray.jpg', '2.4 MB', 'Chest X-ray clear.'),
(3, 1, 'ECG Report', 'ECG', '15 Jul 2026', 'Dr. Mehta', 'Reviewed', 'ecg-report.pdf', '840 KB', 'Normal sinus rhythm.'),
(4, 1, 'Prescription', 'Prescription', '10 Jul 2026', 'Dr. Mehta', 'Pending', 'prescription.pdf', '540 KB', 'Prescription follow-up.')
ON DUPLICATE KEY UPDATE id=id;

-- Initial Nearby Medical Services
INSERT INTO medical_services (id, name, service_type, distance, phone, address, icon) VALUES
(1, 'City Care Hospital', 'Hospital', '2.1 km', '+91 20 5550 0100', 'Multispecialty Healthcare Centre, Main St', '🏥'),
(2, 'Shree Medical Store', 'Medical Store', '1.5 km', '+91 20 5550 0101', 'Near College Road, Market Yard', '💊'),
(3, 'ABC Diagnostic Lab', 'Diagnostic Lab', '2.5 km', '+91 20 5550 0102', 'Pathology & Blood Tests Centre, Station Road', '🧪'),
(4, 'Life Care Hospital', 'Hospital', '3.0 km', '+91 20 5550 0103', 'General & Emergency Hospital, Ring Road', '🏥')
ON DUPLICATE KEY UPDATE id=id;

-- Initial Instruction Videos
INSERT INTO health_videos (id, title, category, duration, tag, icon) VALUES
(1, 'How to take medicines correctly', 'Medicine Usage', '05:30 min', 'Health education', '💊'),
(2, 'Breathing Exercises for Better Health', 'Exercise', '07:12 min', 'Health education', '🧘'),
(3, 'Healthy Diet Plan', 'Diet & Nutrition', '06:20 min', 'Health education', '🥗'),
(4, 'Post-Surgery Care Tips', 'General Health', '04:15 min', 'Health education', '🛏️'),
(5, 'Diabetes Care Guide', 'General Health', '08:10 min', 'Health education', '🩸'),
(6, 'Women''s Health Tips', 'General Health', '07:25 min', 'Health education', '👩‍⚕️')
ON DUPLICATE KEY UPDATE id=id;

-- Initial Chat Messages
INSERT INTO chat_messages (id, user_id, sender, doctor_name, message) VALUES
(1, 1, 'doctor', 'Dr. Priya Sharma', 'Hello Avishkar, how are you feeling today?'),
(2, 1, 'patient', 'Dr. Priya Sharma', 'Hello Doctor. I have a question about my medicine.')
ON DUPLICATE KEY UPDATE id=id;

-- Initial Progress Log
INSERT INTO progress_logs (id, user_id, log_date, weight_kg, feeling, medicines_taken, water_intake, exercise_minutes, steps_today, blood_pressure, hemoglobin) VALUES
(1, 1, '2026-10-12', 72.0, 'Good', '3 of 3 planned', '2.5 litres', 30, 8000, '120/80', 11.2)
ON DUPLICATE KEY UPDATE id=id;
