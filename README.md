# MediCare+ Full Running Healthcare Application

Complete Full-Stack Healthcare Platform with **Java Spring Boot**, **MySQL / SQL Relational Database**, and an interactive Frontend Web Dashboard.

---

## 🌟 Architecture & Features

### 1. User & Authentication Module (`/api/auth`)
- **Patient Registration**: Full Name, Email, Phone, Password (hashed using BCrypt). Auto-generates unique Patient ID (e.g., `MED-1001`).
- **Patient Login**: Supports authentication via Email, Patient ID, or Phone Number.
- **Session & Profile**: Persistent user state with dynamic header avatar, greeting, and profile.

### 2. Medical Reports Module (`/api/reports`)
- **SQL Storage**: Complete medical report metadata and records stored in MySQL table `medical_reports`.
- **File Upload & Storage**: Upload PDF, PNG, JPG files directly to backend `uploads/` directory.
- **Download & View**: Secure endpoint to view or download uploaded files.
- **Category Filtering & Search**: Filter by Blood Test, X-Ray, ECG, Prescription, or Others.
- **Report Deletion**: Deletes database entry and removes physical file.
- **CSV Export**: Export all user medical reports to a `.csv` file.

### 3. Medicines & Reminders Module (`/api/medicines`)
- **Schedule Management**: Name, dosage instructions, and reminder time (e.g. `08:00 AM`).
- **Interactive Reminders**: Toggle active reminder state with instant database persistence.
- **Delete Medicine**: Remove medicines from schedule.
- **Live Statistics**: Summary counters for total medicines, active reminders, and schedule status.

### 4. Doctor Communication & Appointments (`/api/doctors`)
- **Doctor Directory**: List of care team specialists with real-time Online/Offline status.
- **Appointment Booking**: Select doctor, appointment date, and time slot.
- **Live Chat Messaging**: Real-time doctor-patient communication saved in MySQL database `chat_messages`.

### 5. Nearby Medical Services (`/api/services`)
- **Healthcare Directory**: Hospitals, Medical Stores (Pharmacies), and Diagnostic Labs.
- **Filters**: Instant categorization and distance listings.
- **Map & Phone Integration**: One-click Google Maps location search and direct phone calling.

### 6. Health Instruction Videos (`/api/videos`)
- **Educational Videos**: Categorized by Medicine Usage, Exercise, Diet & Nutrition, and General Health.

### 7. Improvement & Progress Tracking (`/api/progress`)
- **Health Metrics**: Weight (kg), Blood Pressure, Hemoglobin, Steps Today, Water Intake, Exercise.
- **Daily Health Logging**: Record daily weight and feeling state into MySQL table `progress_logs`.
- **Progress Trends**: Historical records for tracking health improvements over time.

---

## 🚀 Quick Start Guide

### Option 1: Run with `run-backend.bat`
Simply double-click:
```
run-backend.bat
```
This will compile and launch the Spring Boot server connected to your MySQL database (`medicare_db`).

### Option 2: Run via Terminal
```powershell
cd backend
mvn spring-boot:run
```

Once started:
- **Application URL**: [http://localhost:8080/](http://localhost:8080/)
- **REST API Base**: [http://localhost:8080/api](http://localhost:8080/api)

---

## 🗄️ Database Information (MySQL)

- **Database Name**: `medicare_db`
- **Host**: `localhost:3306`
- **User**: `root`
- **Password**: Configured in `backend/src/main/resources/application.properties`

### Manual Database Creation (Optional)
If you prefer to inspect or run SQL manually in MySQL Workbench / Command Line:
```sql
-- See full schema in backend/schema.sql
-- See initial seed data in backend/data.sql
```

---

## 📁 Project Directory Structure
```
MediCare-/
├── backend/
│   ├── src/main/java/com/medicare/
│   │   ├── MedicareApplication.java
│   │   ├── config/             # CorsConfig, WebConfig, SecurityBeans, DataInitializer
│   │   ├── controller/         # Auth, Report, Medicine, Doctor, Service, Video, Progress
│   │   ├── dto/                # Request & Response Data Transfer Objects
│   │   ├── entity/             # JPA Entities (User, Medicine, MedicalReport, Doctor, etc.)
│   │   ├── repository/         # Spring Data JPA Repositories
│   │   └── service/            # Business Logic & File Storage Services
│   ├── src/main/resources/
│   │   ├── application.properties    # MySQL Configuration
│   │   ├── application-h2.properties # In-Memory Dev Profile
│   │   └── static/                   # Bundled Frontend Web Assets
│   ├── uploads/                      # Uploaded medical report files
│   ├── schema.sql                    # SQL Table Schemas
│   ├── data.sql                      # SQL Seed Records
│   ├── pom.xml                       # Maven Build Configuration
│   └── run.bat                       # Server Launch Script
├── app.js                            # Frontend API Connector & Interactions
├── style.css                         # UI Styling
├── index.html                        # Landing Page
├── login.html                        # Patient Login Page
├── signin.html                       # Patient Account Creation
├── dashboard.html                    # Patient Portal Main Dashboard
├── reports.html                      # Medical Reports Management
├── medicine.html                     # Medicine Schedule & Reminders
├── doctor.html                       # Doctor Chat & Appointments
├── services.html                     # Nearby Medical Facilities
├── videos.html                       # Instruction Video Library
├── progress.html                     # Health Metrics & Daily Logs
└── run-backend.bat                   # Top-level launch script
```
