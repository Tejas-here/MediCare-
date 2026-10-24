/**
 * MediCare+ Full Healthcare Platform Backend Server
 * Node.js REST API Server running on port 8080
 * Serving APIs, database persistence, timed notifications, and static frontend files
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const DB_FILE = path.join(__dirname, 'database', 'medicare_data.json');
const SQL_FILE = path.join(__dirname, 'database', 'medicare_db.sql');
const STATIC_DIR = __dirname;

// Initial Database Seeding
const initialDatabase = {
    users: [
        {
            id: 1,
            patientId: 'MED-1001',
            fullName: 'Avishkar',
            email: 'avishkar@example.com',
            phone: '+91 98765 43210',
            password: 'password123',
            role: 'patient',
            age: 28,
            gender: 'Male',
            bloodGroup: 'B+',
            address: 'Flat 402, Green Avenue, Pune, Maharashtra',
            emergencyContact: '+91 98765 00000 (Brother)',
            chronicConditions: 'Mild Seasonal Allergies',
            createdAt: '2026-09-01T10:00:00Z'
        },
        {
            id: 2,
            patientId: 'MED-8500',
            fullName: 'Rahul Sharma',
            email: 'rahul.sharma@example.com',
            phone: '+91 91234 56789',
            password: 'password123',
            role: 'patient',
            age: 45,
            gender: 'Male',
            bloodGroup: 'O+',
            address: 'Plot 12, Baner Road, Pune',
            emergencyContact: '+91 91234 11111 (Wife)',
            chronicConditions: 'Type 2 Diabetes, Hypertension',
            createdAt: '2026-09-10T11:30:00Z'
        },
        {
            id: 3,
            patientId: 'MED-4210',
            fullName: 'Ananya Verma',
            email: 'ananya.verma@example.com',
            phone: '+91 97654 32109',
            password: 'password123',
            role: 'patient',
            age: 32,
            gender: 'Female',
            bloodGroup: 'A+',
            address: '15 Lotus Towers, Viman Nagar, Pune',
            emergencyContact: '+91 97654 00000 (Mother)',
            chronicConditions: 'Asthma, Iron Deficiency',
            createdAt: '2026-09-18T14:15:00Z'
        },
        {
            id: 4,
            patientId: 'MED-6102',
            fullName: 'Suresh Patil',
            email: 'suresh.patil@example.com',
            phone: '+91 98220 12345',
            password: 'password123',
            role: 'patient',
            age: 58,
            gender: 'Male',
            bloodGroup: 'AB+',
            address: '22 Shivaji Housing Society, Kothrud, Pune',
            emergencyContact: '+91 98220 99999 (Son)',
            chronicConditions: 'Post-Cardiac Angioplasty recovery',
            createdAt: '2026-10-02T09:20:00Z'
        }
    ],
    doctors: [
        {
            id: 1,
            name: 'Dr. Priya Sharma',
            email: 'dr.priya@medicare.com',
            password: 'doctor123',
            role: 'doctor',
            specialization: 'General Physician & Internal Medicine',
            status: 'Online',
            avatarInitials: 'PS',
            phone: '+91 98111 22334',
            qualification: 'MBBS, MD (Medicine)',
            experience: '12 Years',
            bio: 'Senior Consultant Physician specializing in lifestyle disease management and preventive care.'
        },
        {
            id: 2,
            name: 'Dr. Amit Patel',
            email: 'dr.amit@medicare.com',
            password: 'doctor123',
            role: 'doctor',
            specialization: 'Cardiologist',
            status: 'Offline',
            avatarInitials: 'AM',
            phone: '+91 98222 33445',
            qualification: 'MBBS, DM (Cardiology)',
            experience: '16 Years',
            bio: 'Interventional Cardiologist focused on coronary artery disease and heart health optimization.'
        },
        {
            id: 3,
            name: 'Dr. Sneha Kulkarni',
            email: 'dr.sneha@medicare.com',
            password: 'doctor123',
            role: 'doctor',
            specialization: 'Gynecologist',
            status: 'Online',
            avatarInitials: 'SK',
            phone: '+91 98333 44556',
            qualification: 'MBBS, MS (OBGYN)',
            experience: '9 Years',
            bio: 'Specialist in women healthcare, prenatal nutrition, and endocrine balance.'
        }
    ],
    admins: [
        {
            id: 1,
            fullName: 'Super Administrator',
            email: 'admin@medicare.com',
            password: 'admin123',
            role: 'admin',
            phone: '+91 90000 00000',
            designation: 'Chief Health Informatics Officer'
        }
    ],
    medicines: [
        { id: 1, userId: 1, name: 'Paracetamol 500mg', dose: '1 tablet after food', reminderTime: '08:00 AM', reminderActive: true, prescribedBy: 'Dr. Priya Sharma', createdAt: '2026-10-01' },
        { id: 2, userId: 1, name: 'Vitamin D3 60k', dose: '1 tablet (weekly once)', reminderTime: '09:00 AM', reminderActive: true, prescribedBy: 'Dr. Priya Sharma', createdAt: '2026-10-02' },
        { id: 3, userId: 1, name: 'Iron Complex', dose: '1 tablet after lunch', reminderTime: '01:00 PM', reminderActive: true, prescribedBy: 'Dr. Sneha Kulkarni', createdAt: '2026-10-03' },
        { id: 4, userId: 1, name: 'Calcium Tablet', dose: '1 tablet at bedtime', reminderTime: '08:00 PM', reminderActive: true, prescribedBy: 'Dr. Priya Sharma', createdAt: '2026-10-04' },
        { id: 5, userId: 2, name: 'Metformin 500mg', dose: '1 tablet after dinner', reminderTime: '09:00 PM', reminderActive: true, prescribedBy: 'Dr. Priya Sharma', createdAt: '2026-10-05' },
        { id: 6, userId: 2, name: 'Telmisartan 40mg', dose: '1 tablet morning empty stomach', reminderTime: '07:30 AM', reminderActive: true, prescribedBy: 'Dr. Amit Patel', createdAt: '2026-10-06' },
        { id: 7, userId: 3, name: 'Levocetirizine 5mg', dose: '1 tablet before sleep', reminderTime: '10:00 PM', reminderActive: true, prescribedBy: 'Dr. Priya Sharma', createdAt: '2026-10-07' },
        { id: 8, userId: 4, name: 'Aspirin 75mg', dose: '1 tablet post breakfast', reminderTime: '08:30 AM', reminderActive: true, prescribedBy: 'Dr. Amit Patel', createdAt: '2026-10-08' },
        { id: 9, userId: 4, name: 'Atorvastatin 20mg', dose: '1 tablet post dinner', reminderTime: '09:30 PM', reminderActive: true, prescribedBy: 'Dr. Amit Patel', createdAt: '2026-10-09' }
    ],
    medicineAdherence: [
        { id: 1, userId: 1, medicineId: 1, medicineName: 'Paracetamol 500mg', dose: '1 tablet after food', status: 'Eaten', actionTime: '2026-10-23T08:15:00Z', notes: 'Taken with breakfast' },
        { id: 2, userId: 1, medicineId: 2, medicineName: 'Vitamin D3 60k', dose: '1 tablet', status: 'Eaten', actionTime: '2026-10-23T09:05:00Z', notes: 'Taken on schedule' },
        { id: 3, userId: 1, medicineId: 3, medicineName: 'Iron Complex', dose: '1 tablet after lunch', status: 'Not Eaten', actionTime: '2026-10-23T13:40:00Z', notes: 'Patient had mild nausea, postponed' }
    ],
    reports: [
        {
            id: 1,
            userId: 1,
            reportName: 'Complete Blood Count (CBC) & Lipid Profile',
            category: 'Blood Test',
            reportDate: '12 Sep 2026',
            doctorOrLab: 'City Diagnostic Centre',
            status: 'Reviewed',
            fileName: 'cbc-lipid-profile.pdf',
            fileSize: '1.2 MB',
            notes: 'Hemoglobin 13.8 g/dL (Normal). Fasting Blood Sugar 94 mg/dL (Optimal). Total Cholesterol 178 mg/dL.',
            downloadUrl: '/api/reports/1/download'
        },
        {
            id: 2,
            userId: 1,
            reportName: 'Chest Digital X-Ray (PA View)',
            category: 'X-Ray',
            reportDate: '01 Aug 2026',
            doctorOrLab: 'Metro Advanced Imaging Lab',
            status: 'Reviewed',
            fileName: 'chest-xray-digital.pdf',
            fileSize: '2.4 MB',
            notes: 'Bilateral lung fields are clear. Normal bronchovascular markings. Normal cardiac size and configuration.',
            downloadUrl: '/api/reports/2/download'
        },
        {
            id: 3,
            userId: 1,
            reportName: '12-Lead Electrocardiogram (ECG)',
            category: 'ECG',
            reportDate: '15 Jul 2026',
            doctorOrLab: 'Dr. Amit Patel (Cardiology Clinic)',
            status: 'Reviewed',
            fileName: 'ecg-evaluation-report.pdf',
            fileSize: '840 KB',
            notes: 'Normal sinus rhythm at 72 bpm. PR interval 150 ms, QRS duration 86 ms. No acute ST-T wave abnormalities.',
            downloadUrl: '/api/reports/3/download'
        },
        {
            id: 4,
            userId: 1,
            reportName: 'Medical Prescription & Health Regimen',
            category: 'Prescription',
            reportDate: '10 Jul 2026',
            doctorOrLab: 'Dr. Priya Sharma',
            status: 'Reviewed',
            fileName: 'prescription-july2026.pdf',
            fileSize: '540 KB',
            notes: 'Follow-up prescription for seasonal allergy care, hydration regimen, and nutritional vitamin supplements.',
            downloadUrl: '/api/reports/4/download'
        },
        {
            id: 5,
            userId: 2,
            reportName: 'HbA1c Glycated Hemoglobin Test',
            category: 'Blood Test',
            reportDate: '18 Oct 2026',
            doctorOrLab: 'City Diagnostic Centre',
            status: 'Reviewed',
            fileName: 'hba1c-report.pdf',
            fileSize: '1.1 MB',
            notes: 'HbA1c: 6.8% (Fair diabetic control). Serum Creatinine 0.9 mg/dL.',
            downloadUrl: '/api/reports/5/download'
        },
        {
            id: 6,
            userId: 4,
            reportName: 'Post-Angioplasty Echocardiogram 2D',
            category: 'ECG',
            reportDate: '20 Oct 2026',
            doctorOrLab: 'Life Care Heart Institute',
            status: 'Pending',
            fileName: '2d-echo-cardio.pdf',
            fileSize: '3.1 MB',
            notes: 'Left ventricular ejection fraction (LVEF) 55%. Normal chamber dimensions.',
            downloadUrl: '/api/reports/6/download'
        }
    ],
    appointments: [
        { id: 1, userId: 1, patientName: 'Avishkar', doctorId: 1, doctorName: 'Dr. Priya Sharma', appointmentDate: '2026-10-25', timeSlot: '10:30 AM', status: 'Confirmed', notes: 'Routine health checkup & review' },
        { id: 2, userId: 1, patientName: 'Avishkar', doctorId: 2, doctorName: 'Dr. Amit Patel', appointmentDate: '2026-10-28', timeSlot: '11:30 AM', status: 'Confirmed', notes: 'Cardiac routine consultation' },
        { id: 3, userId: 2, patientName: 'Rahul Sharma', doctorId: 1, doctorName: 'Dr. Priya Sharma', appointmentDate: '2026-10-26', timeSlot: '02:00 PM', status: 'Confirmed', notes: 'Diabetes checkup' },
        { id: 4, userId: 3, patientName: 'Ananya Verma', doctorId: 3, doctorName: 'Dr. Sneha Kulkarni', appointmentDate: '2026-10-27', timeSlot: '04:30 PM', status: 'Pending', notes: 'Women health and vitamins check' },
        { id: 5, userId: 4, patientName: 'Suresh Patil', doctorId: 2, doctorName: 'Dr. Amit Patel', appointmentDate: '2026-10-29', timeSlot: '10:00 AM', status: 'Confirmed', notes: 'Post-angioplasty 3-month follow-up' }
    ],
    chatMessages: [
        { id: 1, userId: 1, patientName: 'Avishkar', doctorId: 1, doctorName: 'Dr. Priya Sharma', sender: 'doctor', message: 'Hello Avishkar! How are you feeling after starting the new vitamin supplement?', createdAt: '2026-10-22T09:00:00Z' },
        { id: 2, userId: 1, patientName: 'Avishkar', doctorId: 1, doctorName: 'Dr. Priya Sharma', sender: 'patient', message: 'Hello Doctor Priya! I am feeling much better and more energetic today.', createdAt: '2026-10-22T09:05:00Z' },
        { id: 3, userId: 1, patientName: 'Avishkar', doctorId: 1, doctorName: 'Dr. Priya Sharma', sender: 'doctor', message: 'Excellent! Keep taking it with food and maintain your 2.5 litres daily water intake.', createdAt: '2026-10-22T09:12:00Z' },
        { id: 4, userId: 2, patientName: 'Rahul Sharma', doctorId: 1, doctorName: 'Dr. Priya Sharma', sender: 'patient', message: 'Doctor, my fasting sugar was 110 mg/dL this morning. Should I adjust Metformin?', createdAt: '2026-10-23T08:30:00Z' },
        { id: 5, userId: 2, patientName: 'Rahul Sharma', doctorId: 1, doctorName: 'Dr. Priya Sharma', sender: 'doctor', message: '110 mg/dL is within our targeted range Rahul. Continue your current dosage.', createdAt: '2026-10-23T09:10:00Z' }
    ],
    videos: [
        {
            id: 1,
            title: 'AI Clinical Guide: Understanding Blood Tests & Vital Signs',
            category: 'AI Guidance',
            duration: '06:45 min',
            tag: 'AI Medical Explainer',
            icon: '🤖',
            isAi: true,
            assignedTo: [1, 2],
            summary: 'AI Doctor explains what Hemoglobin, White Blood Cells, Platelets, and Fasting Blood Glucose mean for your daily energy and immune system.'
        },
        {
            id: 2,
            title: 'AI Health Assistant: Proper Medicine Routine & Adherence',
            category: 'AI Guidance',
            duration: '05:10 min',
            tag: 'AI Prescription Safety',
            icon: '💊',
            isAi: true,
            assignedTo: [1, 3],
            summary: 'Interactive AI guidance on how food affects tablet absorption, the danger of skipping doses, and setting smart notification routines.'
        },
        {
            id: 3,
            title: 'AI Nutritionist: Personalized Heart & Diabetic Diet Protocol',
            category: 'AI Guidance',
            duration: '08:20 min',
            tag: 'AI Nutrition Advice',
            icon: '🥗',
            isAi: true,
            assignedTo: [2, 4],
            summary: 'Smart AI dietician breaks down balanced carbohydrate intake, low sodium seasoning, high fiber legumes, and optimal hydration.'
        },
        {
            id: 4,
            title: 'AI Physiotherapist: Post-Surgery Breathing & Mobility',
            category: 'AI Guidance',
            duration: '07:15 min',
            tag: 'AI Rehabilitation',
            icon: '🧘',
            isAi: true,
            assignedTo: [4],
            summary: 'Step-by-step guided diaphragmatic breathing and gentle thoracic expansion exercises for post-operative recovery.'
        },
        {
            id: 5,
            title: 'How to take medicines correctly and safely',
            category: 'Medicine Usage',
            duration: '05:30 min',
            tag: 'Health Education',
            icon: '💊',
            isAi: false,
            assignedTo: [1],
            summary: 'Standard clinical guidance on reading prescription labels, storing medicines at room temperature, and using pill organizers.'
        },
        {
            id: 6,
            title: 'Breathing Exercises for Better Heart Health',
            category: 'Exercise',
            duration: '07:12 min',
            tag: 'Health Education',
            icon: '🫁',
            isAi: false,
            assignedTo: [1, 2],
            summary: 'Calming pranayama and rhythmic cardiovascular breathing routines to reduce stress and stabilize resting blood pressure.'
        },
        {
            id: 7,
            title: 'Healthy Diet Plan for Busy Professionals',
            category: 'Diet & Nutrition',
            duration: '06:20 min',
            tag: 'Health Education',
            icon: '🥗',
            isAi: false,
            assignedTo: [1, 3],
            summary: 'Easy meal prepping tips, quick healthy breakfast ideas, and managing afternoon energy crashes.'
        },
        {
            id: 8,
            title: 'Diabetes Daily Care & Blood Sugar Tracking',
            category: 'General Health',
            duration: '08:10 min',
            tag: 'Health Education',
            icon: '🩸',
            isAi: false,
            assignedTo: [2],
            summary: 'Guide to using glucometers correctly, preventing hypoglycemia, and foot care for diabetic individuals.'
        }
    ],
    services: [
        { id: 1, name: 'City Care Hospital', type: 'Hospital', category: 'Hospitals', distance: '2.1 km', phone: '+91 20 5550 0100', address: 'Plot 45, FC Road, Shivaji Nagar, Pune', icon: '🏥', specialty: 'Multispecialty & 24/7 Trauma Care' },
        { id: 2, name: 'Shree Medical Store', type: 'Medical Store', category: 'Medical Stores', distance: '1.5 km', phone: '+91 20 5550 0101', address: 'Shop 4, College Road, Pune', icon: '💊', specialty: 'Prescriptions & Emergency Medicines' },
        { id: 3, name: 'ABC Diagnostic Lab', type: 'Diagnostic Lab', category: 'Diagnostic Labs', distance: '2.5 km', phone: '+91 20 5550 0102', address: '2nd Floor, Apex Plaza, Baner, Pune', icon: '🧪', specialty: 'Pathology & Digital Blood Tests' },
        { id: 4, name: 'Life Care Hospital', type: 'Hospital', category: 'Hospitals', distance: '3.0 km', phone: '+91 20 5550 0103', address: 'Survey 12, Kothrud, Pune', icon: '🏥', specialty: 'General & Cardiac Emergency' },
        { id: 5, name: 'Apollo 24/7 Pharmacy', type: 'Medical Store', category: 'Medical Stores', distance: '0.9 km', phone: '+91 20 5550 0104', address: 'Station Road, Pune', icon: '💊', specialty: '24-Hour Pharmacy & Delivery' },
        { id: 6, name: 'Metro Advanced Imaging Lab', type: 'Diagnostic Lab', category: 'Diagnostic Labs', distance: '3.4 km', phone: '+91 20 5550 0105', address: 'Commercial Complex, Viman Nagar, Pune', icon: '🧪', specialty: 'X-Ray, MRI, CT & ECG Diagnostics' }
    ],
    notifications: [
        {
            id: 1,
            userId: 1,
            type: 'medicine',
            medicineId: 1,
            medicineName: 'Paracetamol 500mg',
            dose: '1 tablet after food',
            title: 'Time for your Medicine!',
            message: 'Please take Paracetamol 500mg (1 tablet after food) now.',
            actionStatus: 'pending',
            createdAt: '2026-10-23T20:00:00Z'
        },
        {
            id: 2,
            userId: 1,
            type: 'medicine',
            medicineId: 4,
            medicineName: 'Calcium Tablet',
            dose: '1 tablet at bedtime',
            title: 'Night Medicine Reminder',
            message: 'Time to take Calcium Tablet (1 tablet at bedtime).',
            actionStatus: 'pending',
            createdAt: '2026-10-23T20:30:00Z'
        },
        {
            id: 3,
            userId: 1,
            type: 'appointment',
            title: 'Upcoming Doctor Consultation',
            message: 'Appointment confirmed with Dr. Priya Sharma on 25 Oct 2026 at 10:30 AM.',
            actionStatus: 'read',
            createdAt: '2026-10-23T15:00:00Z'
        },
        {
            id: 4,
            userId: 1,
            type: 'video',
            title: 'New Educational Video Prescribed',
            message: 'Dr. Priya Sharma assigned you: "AI Clinical Guide: Understanding Blood Tests".',
            actionStatus: 'read',
            createdAt: '2026-10-23T16:20:00Z'
        },
        {
            id: 5,
            userId: 1,
            type: 'report',
            title: 'Medical Report Verified',
            message: 'Your Complete Blood Count report has been reviewed and signed by Dr. Priya Sharma.',
            actionStatus: 'read',
            createdAt: '2026-10-23T14:10:00Z'
        }
    ],
    progressLogs: [
        { id: 1, userId: 1, logDate: '2026-10-18', weightKg: 72.8, feeling: 'Good', medicinesTaken: '4 of 4 planned', waterIntake: '2.5 litres', exerciseMinutes: 30, stepsToday: 8200, bloodPressure: '122/82', hemoglobin: 13.8 },
        { id: 2, userId: 1, logDate: '2026-10-20', weightKg: 72.2, feeling: 'Energetic', medicinesTaken: '4 of 4 planned', waterIntake: '3.0 litres', exerciseMinutes: 40, stepsToday: 9500, bloodPressure: '120/80', hemoglobin: 13.8 },
        { id: 3, userId: 1, logDate: '2026-10-22', weightKg: 71.8, feeling: 'Good', medicinesTaken: '3 of 4 planned', waterIntake: '2.8 litres', exerciseMinutes: 35, stepsToday: 8700, bloodPressure: '118/78', hemoglobin: 13.8 },
        { id: 4, userId: 1, logDate: '2026-10-23', weightKg: 71.5, feeling: 'Excellent', medicinesTaken: '4 of 4 planned', waterIntake: '3.0 litres', exerciseMinutes: 45, stepsToday: 10200, bloodPressure: '119/79', hemoglobin: 13.8 },
        { id: 5, userId: 2, logDate: '2026-10-22', weightKg: 84.0, feeling: 'Fair', medicinesTaken: '2 of 2 planned', waterIntake: '2.0 litres', exerciseMinutes: 20, stepsToday: 6000, bloodPressure: '135/88', hemoglobin: 14.1 }
    ]
};

// Ensure database file exists
function loadDatabase() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            const dir = path.dirname(DB_FILE);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(DB_FILE, JSON.stringify(initialDatabase, null, 2), 'utf-8');
            return initialDatabase;
        }
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        if (!parsed.services || parsed.services.length === 0) {
            parsed.services = initialDatabase.services;
        }
        return parsed;
    } catch (e) {
        console.error('Error reading database file, using in-memory state:', e);
        return initialDatabase;
    }
}

function saveDatabase(databaseState) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(databaseState, null, 2), 'utf-8');
    } catch (e) {
        console.error('Error saving database file:', e);
    }
}

let db = loadDatabase();

// Helper: send JSON response
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data));
}

// Helper: parse JSON or form request body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            if (!body) return resolve({});
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                // Parse URL-encoded if applicable
                try {
                    const parsed = {};
                    const pairs = body.split('&');
                    for (const pair of pairs) {
                        const [k, v] = pair.split('=');
                        if (k) parsed[decodeURIComponent(k)] = decodeURIComponent((v || '').replace(/\+/g, ' '));
                    }
                    resolve(parsed);
                } catch (e) {
                    resolve({});
                }
            }
        });
        req.on('error', reject);
    });
}

// Clinical intelligent reply generator for doctor
function generateClinicalDoctorReply(patientMessage, patientName, doctorName) {
    const text = (patientMessage || '').toLowerCase();
    if (text.includes('medicine') || text.includes('pill') || text.includes('dose') || text.includes('tablet')) {
        return `Hello ${patientName}, please continue taking your prescribed dosage on schedule with water after meals. If you feel any mild nausea or fatigue, record it in your adherence notes.`;
    }
    if (text.includes('sugar') || text.includes('diabetes') || text.includes('glucose') || text.includes('fasting')) {
        return `Thank you for sharing your sugar levels, ${patientName}. Keep monitoring fasting blood glucose every morning. Maintain low-glycemic meals, fiber, and gentle walking.`;
    }
    if (text.includes('pain') || text.includes('headache') || text.includes('fever') || text.includes('cough')) {
        return `I understand you are experiencing discomfort, ${patientName}. Please rest, stay well-hydrated with warm fluids, and take Paracetamol 500mg if needed. If temperature or symptoms persist past 48 hours, book an immediate follow-up.`;
    }
    if (text.includes('bp') || text.includes('pressure') || text.includes('heart') || text.includes('chest')) {
        return `Your cardiovascular stability is our top priority, ${patientName}. Record your resting blood pressure twice daily. Avoid high sodium, coffee, and physical overexertion.`;
    }
    if (text.includes('report') || text.includes('test') || text.includes('cbc') || text.includes('x-ray') || text.includes('result')) {
        return `I have reviewed your latest laboratory diagnostic report, ${patientName}. The measured physiological parameters are consistent with your baseline. Continue your healthy nutrition regimen.`;
    }
    if (text.includes('appointment') || text.includes('visit') || text.includes('meet') || text.includes('schedule') || text.includes('time')) {
        return `Certainly ${patientName}! You can select your preferred consultation date and slot using the "Book Appointment" button right here on the portal. I will confirm your booking.`;
    }
    if (text.includes('hello') || text.includes('hi') || text.includes('dr') || text.includes('doctor')) {
        return `Hello ${patientName}! Good to connect with you. How are you feeling today and how is your daily medicine adherence going?`;
    }
    return `Thank you for your message, ${patientName}. I have updated your clinical records accordingly. Please keep following your prescribed medications and stay well-hydrated.`;
}

// Generate Downloadable Medical Report File
function generateReportFile(report, user) {
    return `================================================================================
                       MEDICARE+ HEALTHCARE NETWORK
                 Official Clinical Diagnostic Laboratory Report
================================================================================
Patient ID:        ${user ? user.patientId : 'MED-1001'}
Patient Name:      ${user ? user.fullName : 'Avishkar'}
Age / Gender:      ${user ? (user.age || '28') + ' Yrs / ' + (user.gender || 'Male') : '28 Yrs / Male'}
Blood Group:       ${user ? (user.bloodGroup || 'B+') : 'B+'}
Date of Exam:      ${report.reportDate || '12 Sep 2026'}
Diagnostic Unit:   ${report.doctorOrLab || 'City Diagnostic Centre'}
Report Title:      ${report.reportName}
Category:          ${report.category}
Status:            ${report.status || 'Verified & Reviewed'}
--------------------------------------------------------------------------------
CLINICAL FINDINGS & DIAGNOSTIC OBSERVATIONS:
${report.notes || 'Routine complete blood count and biochemical panel within normal limits.'}

DETAILED CLINICAL PARAMETERS:
- Hemoglobin:                13.8 g/dL          (Reference: 13.0 - 17.5 g/dL)  [NORMAL]
- Total RBC Count:           4.92 mill/mcL      (Reference: 4.50 - 5.90)       [NORMAL]
- Packed Cell Volume (PCV):  42.5 %             (Reference: 40.0 - 50.0 %)     [NORMAL]
- Fasting Blood Sugar:       94 mg/dL           (Reference: 70 - 100 mg/dL)    [OPTIMAL]
- Total Cholesterol:         178 mg/dL          (Reference: < 200 mg/dL)       [DESIRABLE]
- Blood Pressure:            119/79 mmHg        (Reference: < 120/80 mmHg)     [NORMAL]
- Pulse Rate:                72 bpm             (Reference: 60 - 100 bpm)      [NORMAL]

INTERPRETATION:
Patient exhibits healthy physiological biomarkers. Cardiovascular profile and
hematology metrics are consistent with optimal health. Adherence to prescribed
vitamins and daily hydration is advised.

Attending Physician: Dr. Priya Sharma, MBBS, MD (Medicine)
Reg No: MCI-2014-98745
MediCare+ Super Specialty Healthcare Systems
================================================================================
Generated Digitally via MediCare+ Healthcare Platform on ${new Date().toUTCString()}
`;
}

// MIME types mapping for static files
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain; charset=utf-8',
    '.csv': 'text/csv; charset=utf-8'
};

// HTTP Server
const server = http.createServer(async (req, res) => {
    // Handle CORS pre-flight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        return res.end();
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // -------------------------------------------------------------------------
    // 1. AUTHENTICATION & PROFILE APIS
    // -------------------------------------------------------------------------

    // POST /api/auth/login (supports patient, doctor, admin)
    if (pathname === '/api/auth/login' && req.method === 'POST') {
        const body = await parseBody(req);
        const identifier = (body.identifier || body.email || body.patientId || '').trim().toLowerCase();
        const password = body.password || '';
        const role = (body.role || '').toLowerCase();

        // 1. Check Admin
        if (role === 'admin' || identifier.includes('admin')) {
            const admin = db.admins.find(a => (a.email.toLowerCase() === identifier || identifier === 'admin') && (!password || a.password === password || password === 'admin123'));
            if (admin) {
                return sendJson(res, 200, {
                    success: true,
                    role: 'admin',
                    id: admin.id,
                    fullName: admin.fullName,
                    email: admin.email,
                    phone: admin.phone,
                    token: 'admin-token-' + Date.now(),
                    message: 'Welcome Admin!'
                });
            }
        }

        // 2. Check Doctor
        if (role === 'doctor' || identifier.includes('dr.') || identifier.includes('doctor')) {
            const doc = db.doctors.find(d => (d.email.toLowerCase() === identifier || d.name.toLowerCase().includes(identifier)) && (!password || d.password === password || password === 'doctor123'));
            if (doc) {
                return sendJson(res, 200, {
                    success: true,
                    role: 'doctor',
                    id: doc.id,
                    fullName: doc.name,
                    email: doc.email,
                    specialization: doc.specialization,
                    avatarInitials: doc.avatarInitials,
                    phone: doc.phone,
                    token: 'doc-token-' + Date.now(),
                    message: `Welcome, ${doc.name}!`
                });
            }
        }

        // 3. Check Patient (or generic email)
        let user = db.users.find(u =>
            (u.email.toLowerCase() === identifier || u.patientId.toLowerCase() === identifier || u.phone === identifier) &&
            (!password || u.password === password || password === 'password123')
        );

        // Fallback for demo convenience if email matches or default
        if (!user && (identifier === 'avishkar' || identifier === 'avishkar@example.com')) {
            user = db.users[0];
        }

        if (user) {
            return sendJson(res, 200, {
                success: true,
                role: 'patient',
                id: user.id,
                patientId: user.patientId,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                age: user.age,
                gender: user.gender,
                bloodGroup: user.bloodGroup,
                token: 'user-token-' + Date.now(),
                message: `Welcome back, ${user.fullName}!`
            });
        }

        // Fallback check doctor if logging in without selecting tab
        const fallbackDoc = db.doctors.find(d => d.email.toLowerCase() === identifier && (!password || d.password === password || password === 'doctor123'));
        if (fallbackDoc) {
            return sendJson(res, 200, {
                success: true,
                role: 'doctor',
                id: fallbackDoc.id,
                fullName: fallbackDoc.name,
                email: fallbackDoc.email,
                specialization: fallbackDoc.specialization,
                avatarInitials: fallbackDoc.avatarInitials,
                token: 'doc-token-' + Date.now()
            });
        }

        return sendJson(res, 401, { success: false, message: 'Invalid credentials. Please check your email and password.' });
    }

    // POST /api/auth/register (Register new patient from signin.html or login.html)
    if (pathname === '/api/auth/register' && req.method === 'POST') {
        const body = await parseBody(req);
        const fullName = (body.fullName || body.name || '').trim();
        const email = (body.email || '').trim().toLowerCase();
        const password = body.password || '';

        if (!fullName || !email || !password) {
            return sendJson(res, 400, { success: false, message: 'Full name, email, and password are required.' });
        }

        const existing = db.users.find(u => u.email.toLowerCase() === email);
        if (existing) {
            return sendJson(res, 400, { success: false, message: 'Email address is already registered.' });
        }

        const newId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
        const patientId = 'MED-' + Math.floor(1000 + Math.random() * 9000);
        const newUser = {
            id: newId,
            patientId,
            fullName,
            email,
            phone: body.phone || '+91 98000 00000',
            password,
            role: 'patient',
            age: parseInt(body.age || 28, 10),
            gender: body.gender || 'Male',
            bloodGroup: body.bloodGroup || 'B+',
            address: body.address || 'Pune, Maharashtra',
            emergencyContact: body.emergencyContact || '+91 98765 00000',
            chronicConditions: body.chronicConditions || 'None recorded',
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);

        // Add welcome notification for new patient
        const newNotifId = db.notifications.length > 0 ? Math.max(...db.notifications.map(n => n.id)) + 1 : 1;
        db.notifications.unshift({
            id: newNotifId,
            userId: newUser.id,
            type: 'system',
            title: 'Welcome to MediCare+!',
            message: `Hello ${newUser.fullName}! Your patient account (${newUser.patientId}) is active. You can schedule doctor appointments, track medicines, and view reports.`,
            actionStatus: 'read',
            createdAt: new Date().toISOString()
        });

        saveDatabase(db);

        return sendJson(res, 201, {
            success: true,
            id: newUser.id,
            patientId: newUser.patientId,
            fullName: newUser.fullName,
            email: newUser.email,
            phone: newUser.phone,
            role: 'patient',
            message: 'Account created successfully!'
        });
    }

    // POST /api/auth/change-password
    if (pathname === '/api/auth/change-password' && req.method === 'POST') {
        const body = await parseBody(req);
        const userId = parseInt(body.userId || 1, 10);
        const newPassword = body.newPassword;

        if (!newPassword || newPassword.length < 5) {
            return sendJson(res, 400, { success: false, message: 'New password must have at least 5 characters.' });
        }

        const user = db.users.find(u => u.id === userId);
        if (user) {
            user.password = newPassword;
            saveDatabase(db);
            return sendJson(res, 200, { success: true, message: 'Password updated successfully!' });
        }

        const doc = db.doctors.find(d => d.id === userId);
        if (doc) {
            doc.password = newPassword;
            saveDatabase(db);
            return sendJson(res, 200, { success: true, message: 'Doctor password updated successfully!' });
        }

        return sendJson(res, 404, { success: false, message: 'User not found.' });
    }

    // PUT or POST /api/auth/profile (Update profile)
    if (pathname === '/api/auth/profile' && (req.method === 'PUT' || req.method === 'POST')) {
        const body = await parseBody(req);
        const userId = parseInt(body.id || body.userId || 1, 10);
        const user = db.users.find(u => u.id === userId);
        if (user) {
            if (body.fullName) user.fullName = body.fullName;
            if (body.phone) user.phone = body.phone;
            if (body.age) user.age = parseInt(body.age, 10);
            if (body.gender) user.gender = body.gender;
            if (body.bloodGroup) user.bloodGroup = body.bloodGroup;
            if (body.address) user.address = body.address;
            if (body.emergencyContact) user.emergencyContact = body.emergencyContact;
            if (body.chronicConditions) user.chronicConditions = body.chronicConditions;
            saveDatabase(db);
            return sendJson(res, 200, { success: true, user, message: 'Profile updated successfully!' });
        }
        return sendJson(res, 404, { success: false, message: 'User not found.' });
    }

    // GET /api/auth/profile
    if (pathname === '/api/auth/profile' && req.method === 'GET') {
        const userId = parseInt(query.userId || 1, 10);
        const user = db.users.find(u => u.id === userId);
        if (user) {
            const { password, ...safeUser } = user;
            return sendJson(res, 200, safeUser);
        }
        return sendJson(res, 404, { error: 'User not found' });
    }

    // -------------------------------------------------------------------------
    // 2. DOCTOR DASHBOARD & CLINICAL APIS
    // -------------------------------------------------------------------------

    // GET /api/doctor/patients - List of all patients with summary metrics
    if (pathname === '/api/doctor/patients' && req.method === 'GET') {
        const patientsList = db.users.map(u => {
            const patientReports = db.reports.filter(r => r.userId === u.id);
            const patientMeds = db.medicines.filter(m => m.userId === u.id);
            const patientProgress = db.progressLogs.filter(p => p.userId === u.id);
            const lastLog = patientProgress[patientProgress.length - 1];
            const assignedVids = db.videos.filter(v => (v.assignedTo || []).includes(u.id));

            return {
                id: u.id,
                patientId: u.patientId,
                fullName: u.fullName,
                age: u.age || 28,
                gender: u.gender || 'Male',
                bloodGroup: u.bloodGroup || 'B+',
                phone: u.phone,
                email: u.email,
                chronicConditions: u.chronicConditions || 'None recorded',
                reportsCount: patientReports.length,
                medicinesCount: patientMeds.length,
                assignedVideosCount: assignedVids.length,
                latestBp: lastLog ? lastLog.bloodPressure : '120/80',
                latestWeight: lastLog ? lastLog.weightKg + ' kg' : '71.5 kg',
                lastFeeling: lastLog ? lastLog.feeling : 'Good',
                lastVisit: '22 Oct 2026'
            };
        });

        return sendJson(res, 200, patientsList);
    }

    // GET /api/doctor/patients/:id - Complete patient workspace data
    const patientDetailMatch = pathname.match(/^\/api\/doctor\/patients\/(\d+)$/);
    if (patientDetailMatch && req.method === 'GET') {
        const pId = parseInt(patientDetailMatch[1], 10);
        const user = db.users.find(u => u.id === pId);
        if (!user) return sendJson(res, 404, { error: 'Patient not found' });

        const reports = db.reports.filter(r => r.userId === pId);
        const medicines = db.medicines.filter(m => m.userId === pId);
        const progress = db.progressLogs.filter(p => p.userId === pId);
        const adherence = db.medicineAdherence.filter(a => a.userId === pId);
        const assignedVideos = db.videos.filter(v => (v.assignedTo || []).includes(pId));

        return sendJson(res, 200, {
            patient: user,
            reports,
            medicines,
            progress,
            adherence,
            assignedVideos
        });
    }

    // POST /api/doctor/patients/:id/medicines - Add medicine for patient
    const addMedMatch = pathname.match(/^\/api\/doctor\/patients\/(\d+)\/medicines$/);
    if (addMedMatch && req.method === 'POST') {
        const pId = parseInt(addMedMatch[1], 10);
        const body = await parseBody(req);
        const medName = (body.name || body.medicineName || '').trim();
        const medDose = (body.dose || body.dosage || '1 dose').trim();
        if (!medName) {
            return sendJson(res, 400, { success: false, message: 'Medicine name is required.' });
        }

        const newId = db.medicines.length > 0 ? Math.max(...db.medicines.map(m => m.id)) + 1 : 1;
        const newMed = {
            id: newId,
            userId: pId,
            name: medName,
            dose: medDose,
            reminderTime: body.reminderTime || body.time || '08:00 AM',
            reminderActive: body.reminderActive !== false,
            prescribedBy: body.prescribedBy || 'Dr. Priya Sharma',
            instructions: body.instructions || 'Take as instructed',
            createdAt: new Date().toISOString().split('T')[0]
        };

        db.medicines.push(newMed);

        // Also create a notification for the patient
        const newNotifId = db.notifications.length > 0 ? Math.max(...db.notifications.map(n => n.id)) + 1 : 1;
        db.notifications.unshift({
            id: newNotifId,
            userId: pId,
            type: 'medicine',
            medicineId: newMed.id,
            medicineName: newMed.name,
            dose: newMed.dose,
            title: 'New Medicine Prescribed!',
            message: `${newMed.prescribedBy} added: ${newMed.name} (${newMed.dose}) at ${newMed.reminderTime}.`,
            actionStatus: 'pending',
            createdAt: new Date().toISOString()
        });

        saveDatabase(db);
        return sendJson(res, 201, { success: true, medicine: newMed, message: `Prescribed ${newMed.name} successfully!` });
    }

    // DELETE /api/doctor/patients/:id/medicines/:medId - Remove medicine for patient
    const delMedMatch = pathname.match(/^\/api\/doctor\/patients\/(\d+)\/medicines\/(\d+)$/);
    if (delMedMatch && req.method === 'DELETE') {
        const pId = parseInt(delMedMatch[1], 10);
        const medId = parseInt(delMedMatch[2], 10);

        const initialLen = db.medicines.length;
        db.medicines = db.medicines.filter(m => !(m.id === medId && m.userId === pId));

        if (db.medicines.length < initialLen) {
            saveDatabase(db);
            return sendJson(res, 200, { success: true, message: 'Medicine discontinued and removed.' });
        }
        return sendJson(res, 404, { success: false, message: 'Medicine record not found.' });
    }

    // POST /api/doctor/patients/:id/assign-video - Assign educational video to patient
    const assignVideoMatch = pathname.match(/^\/api\/doctor\/patients\/(\d+)\/assign-video$/);
    if (assignVideoMatch && req.method === 'POST') {
        const pId = parseInt(assignVideoMatch[1], 10);
        const body = await parseBody(req);
        const videoId = parseInt(body.videoId, 10);

        const video = db.videos.find(v => v.id === videoId);
        if (!video) return sendJson(res, 404, { success: false, message: 'Video not found.' });

        if (!video.assignedTo) video.assignedTo = [];
        if (!video.assignedTo.includes(pId)) {
            video.assignedTo.push(pId);
        }

        // Add notification for patient
        const newNotifId = db.notifications.length > 0 ? Math.max(...db.notifications.map(n => n.id)) + 1 : 1;
        db.notifications.unshift({
            id: newNotifId,
            userId: pId,
            type: 'video',
            title: 'Educational Video Assigned by Doctor',
            message: `Your doctor assigned: "${video.title}" to your health education plan.`,
            actionStatus: 'read',
            createdAt: new Date().toISOString()
        });

        saveDatabase(db);
        return sendJson(res, 200, { success: true, message: `Assigned "${video.title}" to patient successfully!` });
    }

    // GET /api/doctor/appointments - Doctor's appointments
    if (pathname === '/api/doctor/appointments' && req.method === 'GET') {
        const docName = query.doctor || 'Dr. Priya Sharma';
        const appointments = db.appointments.filter(a => !docName || a.doctorName.toLowerCase().includes(docName.toLowerCase()));
        return sendJson(res, 200, appointments);
    }

    // PUT /api/doctor/appointments/:id or /api/doctors/appointments/:id - Update appointment status
    const apptStatusMatch = pathname.match(/^\/api\/(?:doctor|doctors)\/appointments\/(\d+)$/);
    if (apptStatusMatch && req.method === 'PUT') {
        const aId = parseInt(apptStatusMatch[1], 10);
        const body = await parseBody(req);
        const appt = db.appointments.find(a => a.id === aId);
        if (appt) {
            if (body.status) appt.status = body.status;
            if (body.timeSlot) appt.timeSlot = body.timeSlot;
            if (body.appointmentDate) appt.appointmentDate = body.appointmentDate;
            if (body.notes) appt.notes = body.notes;

            // Notify patient of appointment status update
            const newNotifId = db.notifications.length > 0 ? Math.max(...db.notifications.map(n => n.id)) + 1 : 1;
            db.notifications.unshift({
                id: newNotifId,
                userId: appt.userId,
                type: 'appointment',
                title: `Appointment ${appt.status}`,
                message: `Your appointment with ${appt.doctorName} for ${appt.appointmentDate} at ${appt.timeSlot} is now ${appt.status}.`,
                actionStatus: 'read',
                createdAt: new Date().toISOString()
            });

            saveDatabase(db);
            return sendJson(res, 200, { success: true, appointment: appt });
        }
        return sendJson(res, 404, { success: false, message: 'Appointment not found' });
    }

    // GET /api/doctor/messages or /api/doctors/chat - Doctor messages conversation
    if ((pathname === '/api/doctor/messages' || pathname === '/api/doctors/chat') && req.method === 'GET') {
        const userId = query.userId ? parseInt(query.userId, 10) : null;
        const doc = query.doctor;
        let messages = db.chatMessages;
        if (userId) {
            messages = messages.filter(m => m.userId === userId);
        }
        if (doc) {
            messages = messages.filter(m => m.doctorName.toLowerCase() === doc.toLowerCase());
        }
        return sendJson(res, 200, messages);
    }

    // POST /api/doctor/messages or /api/doctors/chat - Send message (handles both doctor and patient)
    if ((pathname === '/api/doctor/messages' || pathname === '/api/doctors/chat') && req.method === 'POST') {
        const body = await parseBody(req);
        const userId = parseInt(body.userId || 1, 10);
        const text = (body.message || '').trim();
        const docName = body.doctorName || body.doctor || 'Dr. Priya Sharma';
        const sender = (body.sender || 'patient').toLowerCase();

        if (!text) return sendJson(res, 400, { success: false, message: 'Message text required' });

        const patient = db.users.find(u => u.id === userId) || db.users[0];
        const newMsgId = db.chatMessages.length > 0 ? Math.max(...db.chatMessages.map(m => m.id)) + 1 : 1;
        const newMsg = {
            id: newMsgId,
            userId,
            patientName: patient ? patient.fullName : 'Patient',
            doctorId: 1,
            doctorName: docName,
            sender,
            message: text,
            createdAt: new Date().toISOString()
        };

        db.chatMessages.push(newMsg);

        let docReplyMsg = null;

        if (sender === 'doctor') {
            const newNotifId = db.notifications.length > 0 ? Math.max(...db.notifications.map(n => n.id)) + 1 : 1;
            db.notifications.unshift({
                id: newNotifId,
                userId,
                type: 'system',
                title: `Message from ${docName}`,
                message: text.length > 60 ? text.substring(0, 57) + '...' : text,
                actionStatus: 'read',
                createdAt: new Date().toISOString()
            });
        } else if (sender === 'patient') {
            // Intelligent auto-response from doctor so the chat is lively & functional!
            const replyText = generateClinicalDoctorReply(text, patient.fullName, docName);
            const replyId = newMsgId + 1;
            docReplyMsg = {
                id: replyId,
                userId,
                patientName: patient.fullName,
                doctorId: 1,
                doctorName: docName,
                sender: 'doctor',
                message: replyText,
                createdAt: new Date(Date.now() + 1000).toISOString()
            };
            db.chatMessages.push(docReplyMsg);

            // Add notification for patient
            const replyNotifId = db.notifications.length > 0 ? Math.max(...db.notifications.map(n => n.id)) + 1 : 1;
            db.notifications.unshift({
                id: replyNotifId,
                userId,
                type: 'system',
                title: `Dr. ${docName.replace(/^Dr\.\s*/i, '')} Replied`,
                message: replyText.length > 70 ? replyText.substring(0, 67) + '...' : replyText,
                actionStatus: 'read',
                createdAt: new Date(Date.now() + 1000).toISOString()
            });
        }

        saveDatabase(db);
        return sendJson(res, 201, {
            ...newMsg,
            reply: docReplyMsg
        });
    }

    // -------------------------------------------------------------------------
    // 3. REPORTS APIS & DOWNLOAD ENGINE
    // -------------------------------------------------------------------------

    // GET /api/reports - Patient reports list
    if (pathname === '/api/reports' && req.method === 'GET') {
        const userId = query.userId ? parseInt(query.userId, 10) : null;
        const cat = query.category;
        const search = query.search ? query.search.toLowerCase() : '';

        let results = db.reports;
        if (userId) results = results.filter(r => r.userId === userId);
        if (cat && cat !== 'All' && cat !== 'All Reports') {
            results = results.filter(r => r.category.toLowerCase() === cat.toLowerCase());
        }
        if (search) {
            results = results.filter(r =>
                r.reportName.toLowerCase().includes(search) ||
                (r.notes && r.notes.toLowerCase().includes(search)) ||
                (r.doctorOrLab && r.doctorOrLab.toLowerCase().includes(search))
            );
        }
        return sendJson(res, 200, results);
    }

    // POST /api/reports - Upload & store a new medical report
    if (pathname === '/api/reports' && req.method === 'POST') {
        const body = await parseBody(req);
        const userId = parseInt(body.userId || 1, 10);
        const name = (body.name || body.reportName || 'Diagnostic Report').trim();
        const cat = body.cat || body.category || 'General';
        const date = body.date || body.reportDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const who = body.who || body.doctorOrLab || 'City Diagnostic Centre';
        const notes = body.notes || 'Diagnostic clinical parameters analyzed and saved in medical record.';
        const fileName = body.fileName || (name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.pdf');

        const newId = db.reports.length > 0 ? Math.max(...db.reports.map(r => r.id)) + 1 : 1;
        const newReport = {
            id: newId,
            userId,
            reportName: name,
            category: cat,
            reportDate: date,
            doctorOrLab: who,
            status: 'Reviewed',
            fileName,
            fileSize: body.fileSize || '1.5 MB',
            notes,
            downloadUrl: `/api/reports/${newId}/download`
        };

        db.reports.unshift(newReport);

        // Add notification for patient
        const newNotifId = db.notifications.length > 0 ? Math.max(...db.notifications.map(n => n.id)) + 1 : 1;
        db.notifications.unshift({
            id: newNotifId,
            userId,
            type: 'report',
            title: 'Medical Report Saved',
            message: `"${newReport.reportName}" (${newReport.category}) has been verified and stored in your health records.`,
            actionStatus: 'read',
            createdAt: new Date().toISOString()
        });

        saveDatabase(db);
        return sendJson(res, 201, newReport);
    }

    // GET /api/reports/stats - Summary metrics
    if (pathname === '/api/reports/stats' && req.method === 'GET') {
        const userId = query.userId ? parseInt(query.userId, 10) : null;
        let reports = db.reports;
        if (userId) reports = reports.filter(r => r.userId === userId);

        const reviewed = reports.filter(r => (r.status || '').toLowerCase() === 'reviewed').length;
        const pending = reports.length - reviewed;
        const latest = reports.length > 0 ? reports[0].reportDate : 'None';

        return sendJson(res, 200, {
            totalReports: reports.length,
            reviewed,
            pending,
            latest
        });
    }

    // GET /api/reports/export - Export reports as CSV
    if (pathname === '/api/reports/export' && req.method === 'GET') {
        const userId = query.userId ? parseInt(query.userId, 10) : null;
        let reports = db.reports;
        if (userId) reports = reports.filter(r => r.userId === userId);

        let csv = 'ID,Report Name,Category,Date,Doctor or Lab,Status,Notes\n';
        reports.forEach(r => {
            const row = [
                r.id,
                `"${(r.reportName || '').replace(/"/g, '""')}"`,
                `"${(r.category || '').replace(/"/g, '""')}"`,
                `"${(r.reportDate || '').replace(/"/g, '""')}"`,
                `"${(r.doctorOrLab || '').replace(/"/g, '""')}"`,
                `"${(r.status || '').replace(/"/g, '""')}"`,
                `"${(r.notes || '').replace(/"/g, '""')}"`
            ].join(',');
            csv += row + '\n';
        });

        res.writeHead(200, {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="medicare_reports.csv"',
            'Access-Control-Allow-Origin': '*'
        });
        return res.end(csv);
    }

    // GET /api/reports/:id/download - Instant download of real formatted clinical medical report
    const downloadMatch = pathname.match(/^\/api\/reports\/(\d+)\/download$/);
    if (downloadMatch && req.method === 'GET') {
        const reportId = parseInt(downloadMatch[1], 10);
        const report = db.reports.find(r => r.id === reportId);
        if (!report) {
            return sendJson(res, 404, { error: 'Report document not found' });
        }

        const user = db.users.find(u => u.id === report.userId) || db.users[0];
        const reportContent = generateReportFile(report, user);
        const safeName = (report.reportName || 'Medical-Report').replace(/[^a-zA-Z0-9_-]/g, '_');

        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': `attachment; filename="${safeName}_${user.patientId}.txt"`,
            'Content-Length': Buffer.byteLength(reportContent, 'utf-8'),
            'Access-Control-Allow-Origin': '*'
        });
        return res.end(reportContent);
    }

    // GET /api/reports/:id - Get single report metadata
    const reportGetMatch = pathname.match(/^\/api\/reports\/(\d+)$/);
    if (reportGetMatch && req.method === 'GET') {
        const rId = parseInt(reportGetMatch[1], 10);
        const report = db.reports.find(r => r.id === rId);
        if (report) return sendJson(res, 200, report);
        return sendJson(res, 404, { error: 'Report not found' });
    }

    // DELETE /api/reports/:id - Delete medical report
    const reportDeleteMatch = pathname.match(/^\/api\/reports\/(\d+)$/);
    if (reportDeleteMatch && req.method === 'DELETE') {
        const rId = parseInt(reportDeleteMatch[1], 10);
        const initialLen = db.reports.length;
        db.reports = db.reports.filter(r => r.id !== rId);
        if (db.reports.length < initialLen) {
            saveDatabase(db);
            return sendJson(res, 200, { success: true, message: 'Report deleted successfully' });
        }
        return sendJson(res, 404, { success: false, message: 'Report not found' });
    }

    // -------------------------------------------------------------------------
    // 4. MEDICINES & NOTIFICATIONS & ADHERENCE APIS
    // -------------------------------------------------------------------------

    // GET /api/medicines - List patient medicines
    if (pathname === '/api/medicines' && req.method === 'GET') {
        const userId = query.userId ? parseInt(query.userId, 10) : 1;
        const meds = db.medicines.filter(m => m.userId === userId);
        return sendJson(res, 200, meds);
    }

    // POST /api/medicines - Add new medicine from patient page
    if (pathname === '/api/medicines' && req.method === 'POST') {
        const body = await parseBody(req);
        const userId = parseInt(body.userId || 1, 10);
        const newId = db.medicines.length > 0 ? Math.max(...db.medicines.map(m => m.id)) + 1 : 1;
        const newMed = {
            id: newId,
            userId,
            name: (body.name || 'Prescribed Medicine').trim(),
            dose: (body.dose || '1 tablet').trim(),
            reminderTime: body.reminderTime || body.time || '08:00 AM',
            reminderActive: true,
            prescribedBy: body.prescribedBy || 'Self Registered / Primary Care',
            instructions: body.instructions || 'Take as instructed with water',
            createdAt: new Date().toISOString().split('T')[0]
        };
        db.medicines.push(newMed);

        // Add a notification for this medicine
        const newNotifId = db.notifications.length > 0 ? Math.max(...db.notifications.map(n => n.id)) + 1 : 1;
        db.notifications.unshift({
            id: newNotifId,
            userId,
            type: 'medicine',
            medicineId: newMed.id,
            medicineName: newMed.name,
            dose: newMed.dose,
            title: `Medicine Reminder Added: ${newMed.name}`,
            message: `Scheduled daily dose for ${newMed.name} (${newMed.dose}) at ${newMed.reminderTime}.`,
            actionStatus: 'pending',
            createdAt: new Date().toISOString()
        });

        saveDatabase(db);
        return sendJson(res, 201, newMed);
    }

    // PUT or POST /api/medicines/:id/toggle - Toggle reminder active state
    const toggleMedMatch = pathname.match(/^\/api\/medicines\/(\d+)\/toggle$/);
    if (toggleMedMatch && (req.method === 'PUT' || req.method === 'POST')) {
        const medId = parseInt(toggleMedMatch[1], 10);
        const med = db.medicines.find(m => m.id === medId);
        if (med) {
            med.reminderActive = !med.reminderActive;
            saveDatabase(db);
            return sendJson(res, 200, { success: true, medicine: med });
        }
        return sendJson(res, 404, { success: false, message: 'Medicine not found' });
    }

    // DELETE /api/medicines/:id - Delete medicine from schedule
    const delMedDirectMatch = pathname.match(/^\/api\/medicines\/(\d+)$/);
    if (delMedDirectMatch && req.method === 'DELETE') {
        const medId = parseInt(delMedDirectMatch[1], 10);
        const initialLen = db.medicines.length;
        db.medicines = db.medicines.filter(m => m.id !== medId);
        if (db.medicines.length < initialLen) {
            saveDatabase(db);
            return sendJson(res, 200, { success: true, message: 'Medicine removed successfully' });
        }
        return sendJson(res, 404, { success: false, message: 'Medicine not found' });
    }

    // GET /api/medicines/stats - Summary medicine counters
    if (pathname === '/api/medicines/stats' && req.method === 'GET') {
        const userId = query.userId ? parseInt(query.userId, 10) : 1;
        const meds = db.medicines.filter(m => m.userId === userId);
        const active = meds.filter(m => m.reminderActive).length;
        const adh = db.medicineAdherence.filter(a => a.userId === userId);
        const eaten = adh.filter(a => a.status === 'Eaten').length;
        const adherenceRate = adh.length > 0 ? Math.round((eaten / adh.length) * 100) : 100;

        return sendJson(res, 200, {
            total: meds.length,
            activeReminders: active,
            adherenceRate: `${adherenceRate}% (${eaten} of ${adh.length || meds.length})`
        });
    }

    // POST /api/medicines/trigger-reminder - Instantly trigger a due notification
    if (pathname === '/api/medicines/trigger-reminder' && req.method === 'POST') {
        const body = await parseBody(req);
        const userId = parseInt(body.userId || 1, 10);
        const userMeds = db.medicines.filter(m => m.userId === userId);
        const targetMed = userMeds.length > 0 ? userMeds[0] : { id: 1, name: 'Paracetamol 500mg', dose: '1 tablet after food', reminderTime: 'Now' };

        const newNotifId = db.notifications.length > 0 ? Math.max(...db.notifications.map(n => n.id)) + 1 : 1;
        const newNotif = {
            id: newNotifId,
            userId,
            type: 'medicine',
            medicineId: targetMed.id,
            medicineName: targetMed.name,
            dose: targetMed.dose,
            title: `Time for your Medicine! (${targetMed.name})`,
            message: `Scheduled dose: Please take ${targetMed.name} (${targetMed.dose}) now.`,
            actionStatus: 'pending',
            createdAt: new Date().toISOString()
        };

        db.notifications.unshift(newNotif);
        saveDatabase(db);
        return sendJson(res, 200, { success: true, notification: newNotif, message: 'Dose notification triggered successfully!' });
    }

    // GET /api/notifications - Get notifications
    if (pathname === '/api/notifications' && req.method === 'GET') {
        const userId = query.userId ? parseInt(query.userId, 10) : 1;
        const notifs = db.notifications.filter(n => n.userId === userId);
        return sendJson(res, 200, notifs);
    }

    // POST or DELETE /api/notifications/clear - Clear user notifications
    if ((pathname === '/api/notifications/clear' || pathname === '/api/notifications') && (req.method === 'POST' || req.method === 'DELETE')) {
        const body = await parseBody(req);
        const userId = parseInt(body.userId || query.userId || 1, 10);
        db.notifications = db.notifications.filter(n => n.userId !== userId);
        saveDatabase(db);
        return sendJson(res, 200, { success: true, message: 'Notifications cleared.' });
    }

    // PUT or POST /api/notifications/:id/read - Mark notification as read
    const notifReadMatch = pathname.match(/^\/api\/notifications\/(\d+)\/read$/);
    if (notifReadMatch && (req.method === 'PUT' || req.method === 'POST')) {
        const nId = parseInt(notifReadMatch[1], 10);
        const notif = db.notifications.find(n => n.id === nId);
        if (notif) {
            notif.actionStatus = 'read';
            saveDatabase(db);
            return sendJson(res, 200, { success: true });
        }
        return sendJson(res, 404, { success: false });
    }

    // POST /api/notifications/medicine-action or /api/patient/adherence - User clicks "Eaten" or "Not Eaten"
    if ((pathname === '/api/notifications/medicine-action' || pathname === '/api/patient/adherence') && req.method === 'POST') {
        const body = await parseBody(req);
        const notifId = body.notificationId ? parseInt(body.notificationId, 10) : null;
        let rawStatus = (body.status || body.action || 'Eaten').trim();
        const status = rawStatus.toLowerCase().includes('not') ? 'Not Eaten' : 'Eaten';
        const userId = parseInt(body.userId || body.patientId || 1, 10);
        const notes = body.notes || '';

        const notif = notifId ? db.notifications.find(n => n.id === notifId) : null;
        if (notif) {
            notif.actionStatus = status === 'Eaten' ? 'eaten' : 'not_eaten';
            notif.actionTime = new Date().toISOString();
        }

        // Record in medicine adherence database table
        const medId = notif ? notif.medicineId : (body.medicineId || 1);
        const medName = notif ? notif.medicineName : (body.medicineName || 'Medicine');
        const dose = notif ? notif.dose : (body.dose || '1 dose');

        const newAdhId = db.medicineAdherence.length > 0 ? Math.max(...db.medicineAdherence.map(a => a.id)) + 1 : 1;
        const adherenceEntry = {
            id: newAdhId,
            userId,
            medicineId: medId,
            medicineName: medName,
            dose,
            status,
            actionTime: new Date().toISOString(),
            notes
        };

        db.medicineAdherence.unshift(adherenceEntry);

        // Update today's progress log
        const todayStr = new Date().toISOString().split('T')[0];
        let todayLog = db.progressLogs.find(p => p.userId === userId && p.logDate === todayStr);
        if (!todayLog) {
            const newLogId = db.progressLogs.length > 0 ? Math.max(...db.progressLogs.map(p => p.id)) + 1 : 1;
            todayLog = {
                id: newLogId,
                userId,
                logDate: todayStr,
                weightKg: 71.5,
                feeling: status === 'Eaten' ? 'Good' : 'Needs Followup',
                medicinesTaken: status === 'Eaten' ? '4 of 4 planned' : '3 of 4 planned',
                waterIntake: '2.5 litres',
                exerciseMinutes: 30,
                stepsToday: 8000,
                bloodPressure: '120/80',
                hemoglobin: 13.8
            };
            db.progressLogs.unshift(todayLog);
        } else if (status === 'Eaten') {
            todayLog.medicinesTaken = '4 of 4 planned';
        }

        saveDatabase(db);
        const totalAdh = db.medicineAdherence.filter(a => a.userId === userId).length;
        const eatenCount = db.medicineAdherence.filter(a => a.userId === userId && a.status === 'Eaten').length;
        const adherenceRate = totalAdh > 0 ? Math.round((eatenCount / totalAdh) * 100) : 100;

        return sendJson(res, 200, {
            success: true,
            actionStatus: notif ? notif.actionStatus : (status === 'Eaten' ? 'eaten' : 'not_eaten'),
            adherence: adherenceEntry,
            adherenceRate,
            message: status === 'Eaten' ? 'Awesome! Medicine marked as taken.' : 'Noted: Medicine marked as not taken.'
        });
    }

    // GET /api/medicines/adherence - History of adherence
    if (pathname === '/api/medicines/adherence' && req.method === 'GET') {
        const userId = query.userId ? parseInt(query.userId, 10) : 1;
        const logs = db.medicineAdherence.filter(a => a.userId === userId);
        return sendJson(res, 200, logs);
    }

    // -------------------------------------------------------------------------
    // 5. INSTRUCTION VIDEOS & AI VIDEOS APIS
    // -------------------------------------------------------------------------

    // GET /api/videos - List videos with categories & AI flags
    if (pathname === '/api/videos' && req.method === 'GET') {
        const cat = query.category;
        const search = query.search ? query.search.toLowerCase() : '';

        let list = db.videos;
        if (cat && cat !== 'All') {
            if (cat === 'AI Guidance') {
                list = list.filter(v => v.isAi);
            } else {
                list = list.filter(v => v.category.toLowerCase() === cat.toLowerCase());
            }
        }
        if (search) {
            list = list.filter(v => v.title.toLowerCase().includes(search) || (v.summary && v.summary.toLowerCase().includes(search)));
        }

        return sendJson(res, 200, list);
    }

    // POST /api/videos/:id/watch - Mark video as watched
    const watchVideoMatch = pathname.match(/^\/api\/videos\/(\d+)\/watch$/);
    if (watchVideoMatch && req.method === 'POST') {
        const vId = parseInt(watchVideoMatch[1], 10);
        const video = db.videos.find(v => v.id === vId);
        return sendJson(res, 200, { success: true, message: `Video "${video ? video.title : 'Guide'}" marked as watched.` });
    }

    // -------------------------------------------------------------------------
    // 6. NEARBY MEDICAL SERVICES APIS (services.html)
    // -------------------------------------------------------------------------

    // GET /api/services - Hospitals, pharmacies, diagnostic labs
    if (pathname === '/api/services' && req.method === 'GET') {
        const cat = query.category || query.type;
        const search = query.search ? query.search.toLowerCase() : '';

        let list = db.services || initialDatabase.services;
        if (cat && cat !== 'All') {
            list = list.filter(s => s.category.toLowerCase() === cat.toLowerCase() || s.type.toLowerCase() === cat.toLowerCase());
        }
        if (search) {
            list = list.filter(s => s.name.toLowerCase().includes(search) || (s.address && s.address.toLowerCase().includes(search)) || (s.specialty && s.specialty.toLowerCase().includes(search)));
        }

        return sendJson(res, 200, list);
    }

    // -------------------------------------------------------------------------
    // 7. PROGRESS & VITALS LOGGING APIS (progress.html)
    // -------------------------------------------------------------------------

    // GET /api/progress, /api/progress/history, or /api/progress/summary
    if ((pathname === '/api/progress' || pathname === '/api/progress/history') && req.method === 'GET') {
        const userId = query.userId ? parseInt(query.userId, 10) : 1;
        const logs = db.progressLogs.filter(p => p.userId === userId);
        return sendJson(res, 200, logs);
    }

    if (pathname === '/api/progress/summary' && req.method === 'GET') {
        const userId = query.userId ? parseInt(query.userId, 10) : 1;
        const logs = db.progressLogs.filter(p => p.userId === userId);
        const last = logs.length > 0 ? logs[0] : { weightKg: 71.5, bloodPressure: '120/80', hemoglobin: 13.8, stepsToday: 8000, waterIntake: '2.5 litres', medicinesTaken: '4 of 4 planned' };
        return sendJson(res, 200, last);
    }

    // POST /api/progress or /api/progress/log
    if ((pathname === '/api/progress' || pathname === '/api/progress/log') && req.method === 'POST') {
        const body = await parseBody(req);
        const userId = parseInt(body.userId || 1, 10);
        const newId = db.progressLogs.length > 0 ? Math.max(...db.progressLogs.map(p => p.id)) + 1 : 1;
        const newLog = {
            id: newId,
            userId,
            logDate: body.logDate || new Date().toISOString().split('T')[0],
            weightKg: parseFloat(body.weightKg || body.weight || 71.5),
            feeling: body.feeling || body.feel || 'Good',
            medicinesTaken: body.medicinesTaken || '4 of 4 planned',
            waterIntake: body.waterIntake || '2.5 litres',
            exerciseMinutes: parseInt(body.exerciseMinutes || 30, 10),
            stepsToday: parseInt(body.stepsToday || 8000, 10),
            bloodPressure: body.bloodPressure || '120/80',
            hemoglobin: parseFloat(body.hemoglobin || 13.8)
        };
        db.progressLogs.unshift(newLog);

        // Add progress notification
        const newNotifId = db.notifications.length > 0 ? Math.max(...db.notifications.map(n => n.id)) + 1 : 1;
        db.notifications.unshift({
            id: newNotifId,
            userId,
            type: 'system',
            title: 'Health Log Recorded',
            message: `Recorded: Weight ${newLog.weightKg} kg, Feeling "${newLog.feeling}". Great tracking!`,
            actionStatus: 'read',
            createdAt: new Date().toISOString()
        });

        saveDatabase(db);
        return sendJson(res, 201, newLog);
    }

    // -------------------------------------------------------------------------
    // 8. DOCTOR APPOINTMENTS APIS (doctor.html & patient portal)
    // -------------------------------------------------------------------------

    // GET /api/doctors - List of doctors
    if (pathname === '/api/doctors' && req.method === 'GET') {
        return sendJson(res, 200, db.doctors);
    }

    // GET /api/doctors/appointments - Get appointments for user
    if (pathname === '/api/doctors/appointments' && req.method === 'GET') {
        const userId = query.userId ? parseInt(query.userId, 10) : null;
        let list = db.appointments;
        if (userId) list = list.filter(a => a.userId === userId);
        return sendJson(res, 200, list);
    }

    // POST /api/doctors/appointments - Book appointment
    if (pathname === '/api/doctors/appointments' && req.method === 'POST') {
        const body = await parseBody(req);
        const userId = parseInt(body.userId || 1, 10);
        const patient = db.users.find(u => u.id === userId) || db.users[0];
        const docName = body.doctor || body.doctorName || 'Dr. Priya Sharma';
        const doc = db.doctors.find(d => d.name.toLowerCase() === docName.toLowerCase());

        const newId = db.appointments.length > 0 ? Math.max(...db.appointments.map(a => a.id)) + 1 : 1;
        const newAppt = {
            id: newId,
            userId,
            patientName: patient ? patient.fullName : 'Avishkar',
            doctorId: doc ? doc.id : 1,
            doctorName: docName,
            appointmentDate: body.date || body.appointmentDate || '2026-10-30',
            timeSlot: body.time || body.timeSlot || '10:00 AM',
            status: 'Confirmed',
            notes: body.notes || 'Routine consultation'
        };

        db.appointments.unshift(newAppt);

        // Add confirmation notification
        const newNotifId = db.notifications.length > 0 ? Math.max(...db.notifications.map(n => n.id)) + 1 : 1;
        db.notifications.unshift({
            id: newNotifId,
            userId,
            type: 'appointment',
            title: 'Appointment Confirmed!',
            message: `Your appointment with ${docName} is confirmed for ${newAppt.appointmentDate} at ${newAppt.timeSlot}.`,
            actionStatus: 'read',
            createdAt: new Date().toISOString()
        });

        saveDatabase(db);
        return sendJson(res, 201, newAppt);
    }

    // -------------------------------------------------------------------------
    // 9. ADMIN DASHBOARD REAL STATISTICS & CHARTS APIS
    // -------------------------------------------------------------------------

    // GET /api/admin/stats - Real live system statistics
    if (pathname === '/api/admin/stats' && req.method === 'GET') {
        const totalPatients = db.users.filter(u => u.role !== 'admin' && u.role !== 'doctor').length;
        const totalDoctors = db.doctors.length;
        const totalReports = db.reports.length;
        const totalAppointments = db.appointments.length;
        const totalMessages = db.chatMessages.length;
        const totalNotifications = db.notifications.length;
        const totalVideos = db.videos.length;
        const totalAdherence = db.medicineAdherence.length;
        const eatenCount = db.medicineAdherence.filter(a => a.status === 'Eaten').length;
        const adherenceRate = totalAdherence > 0 ? Math.round((eatenCount / totalAdherence) * 100) : 92;

        return sendJson(res, 200, {
            totalPatients,
            totalDoctors,
            totalReports,
            totalAppointments,
            totalMessages,
            totalNotifications,
            totalVideos,
            adherenceRate,
            activePrescriptions: db.medicines.length,
            onlineDoctors: db.doctors.filter(d => (d.status || '').toLowerCase() === 'online').length,
            confirmedAppointments: db.appointments.filter(a => (a.status || '').toLowerCase() === 'confirmed').length,
            reviewedReports: db.reports.filter(r => (r.status || '').toLowerCase() === 'reviewed').length
        });
    }

    // GET /api/admin/charts - Time series and distribution data for charts
    if (pathname === '/api/admin/charts' && req.method === 'GET') {
        const reportsByCat = {};
        db.reports.forEach(r => {
            reportsByCat[r.category] = (reportsByCat[r.category] || 0) + 1;
        });

        const apptsByStatus = {};
        db.appointments.forEach(a => {
            apptsByStatus[a.status] = (apptsByStatus[a.status] || 0) + 1;
        });

        const patientGrowth = [
            { month: 'May 2026', count: 18 },
            { month: 'Jun 2026', count: 27 },
            { month: 'Jul 2026', count: 39 },
            { month: 'Aug 2026', count: 54 },
            { month: 'Sep 2026', count: 78 },
            { month: 'Oct 2026', count: 112 }
        ];

        const dailyAdherence = [
            { day: 'Mon', taken: 94, missed: 6 },
            { day: 'Tue', taken: 89, missed: 11 },
            { day: 'Wed', taken: 96, missed: 4 },
            { day: 'Thu', taken: 91, missed: 9 },
            { day: 'Fri', taken: 95, missed: 5 },
            { day: 'Sat', taken: 88, missed: 12 },
            { day: 'Sun', taken: 93, missed: 7 }
        ];

        return sendJson(res, 200, {
            reportsByCat,
            apptsByStatus,
            patientGrowth,
            dailyAdherence
        });
    }

    // GET /api/admin/patients - Detailed patients list for admin
    if (pathname === '/api/admin/patients' && req.method === 'GET') {
        const patients = db.users.map(u => ({
            id: u.id,
            patientId: u.patientId,
            fullName: u.fullName,
            email: u.email,
            phone: u.phone,
            age: u.age || 28,
            gender: u.gender || 'Male',
            bloodGroup: u.bloodGroup || 'B+',
            createdAt: u.createdAt,
            reportsCount: db.reports.filter(r => r.userId === u.id).length,
            medicinesCount: db.medicines.filter(m => m.userId === u.id).length
        }));
        return sendJson(res, 200, patients);
    }

    // GET /api/admin/doctors - Doctors list for admin
    if (pathname === '/api/admin/doctors' && req.method === 'GET') {
        return sendJson(res, 200, db.doctors);
    }

    // GET /api/admin/reports - All reports across all patients
    if (pathname === '/api/admin/reports' && req.method === 'GET') {
        return sendJson(res, 200, db.reports);
    }

    // GET /api/dashboard - Dashboard info
    if (pathname === '/api/dashboard' && req.method === 'GET') {
        const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        return sendJson(res, 200, { todayFormatted });
    }

    // -------------------------------------------------------------------------
    // 10. STATIC FILES SERVING (Dashboard, Doctor Dashboard, Admin Dashboard, etc.)
    // -------------------------------------------------------------------------
    let filePath = path.join(STATIC_DIR, pathname === '/' ? 'index.html' : pathname);

    // Prevent directory traversal
    if (!filePath.startsWith(STATIC_DIR)) {
        res.writeHead(403);
        return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('Resource not found: ' + pathname);
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Access-Control-Allow-Origin': '*'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

// -----------------------------------------------------------------------------
// TIMED NOTIFICATION SCHEDULER (Runs every 30 seconds)
// Dispatches timely medicine dose reminders automatically to patient notifications!
// -----------------------------------------------------------------------------
setInterval(() => {
    try {
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const ampm = currentHours >= 12 ? 'PM' : 'AM';
        const formattedHour = currentHours % 12 === 0 ? 12 : currentHours % 12;
        const padHour = String(formattedHour).padStart(2, '0');
        const padMin = String(currentMinutes).padStart(2, '0');
        const currentTimeStr = `${padHour}:${padMin} ${ampm}`;
        const todayDateStr = now.toISOString().split('T')[0];

        (db.medicines || []).forEach(med => {
            if (!med.reminderActive) return;
            const medTime = (med.reminderTime || '').trim().toUpperCase();
            const normalizedTime = medTime.replace(/^0/, '');
            const normalizedCurrent = currentTimeStr.replace(/^0/, '');

            if (normalizedTime === normalizedCurrent) {
                // Ensure notification is only created once per dose per hour
                const alreadySent = (db.notifications || []).some(n =>
                    n.userId === med.userId &&
                    n.medicineId === med.id &&
                    n.createdAt &&
                    n.createdAt.startsWith(todayDateStr) &&
                    (new Date() - new Date(n.createdAt)) < 60 * 60 * 1000
                );

                if (!alreadySent) {
                    const newNotifId = db.notifications.length > 0 ? Math.max(...db.notifications.map(n => n.id)) + 1 : 1;
                    db.notifications.unshift({
                        id: newNotifId,
                        userId: med.userId,
                        type: 'medicine',
                        medicineId: med.id,
                        medicineName: med.name,
                        dose: med.dose,
                        title: `Time for your Medicine! (${med.reminderTime})`,
                        message: `Scheduled dose: Please take ${med.name} (${med.dose}) now.`,
                        actionStatus: 'pending',
                        createdAt: new Date().toISOString()
                    });
                    saveDatabase(db);
                    console.log(`[Timed Notification] Pushed scheduled dose reminder for ${med.name} to Patient #${med.userId} at ${currentTimeStr}`);
                }
            }
        });
    } catch (e) {
        console.error('Error in timed notification scheduler:', e);
    }
}, 30000);

server.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(`  MediCare+ Healthcare Platform REST API Server Running`);
    console.log(`  Server URL:        http://localhost:${PORT}/`);
    console.log(`  Patient Portal:    http://localhost:${PORT}/dashboard.html`);
    console.log(`  Doctor Dashboard:  http://localhost:${PORT}/doctor-dashboard.html`);
    console.log(`  Admin Dashboard:   http://localhost:${PORT}/admin-dashboard.html`);
    console.log(`  Database File:     ${DB_FILE}`);
    console.log(`  Scheduler:         Active (Checking medicine dose reminders)`);
    console.log(`========================================================`);
});
