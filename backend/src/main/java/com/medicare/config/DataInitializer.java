package com.medicare.config;

import com.medicare.entity.*;
import com.medicare.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final MedicineRepository medicineRepository;
    private final MedicalReportRepository reportRepository;
    private final MedicalServiceRepository serviceRepository;
    private final HealthVideoRepository videoRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ProgressLogRepository progressLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DoctorRepository doctorRepository,
                           MedicineRepository medicineRepository,
                           MedicalReportRepository reportRepository,
                           MedicalServiceRepository serviceRepository,
                           HealthVideoRepository videoRepository,
                           ChatMessageRepository chatMessageRepository,
                           ProgressLogRepository progressLogRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.medicineRepository = medicineRepository;
        this.reportRepository = reportRepository;
        this.serviceRepository = serviceRepository;
        this.videoRepository = videoRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.progressLogRepository = progressLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Initial User
        User defaultUser = null;
        if (userRepository.count() == 0) {
            defaultUser = new User(
                    "MED-1001",
                    "Avishkar",
                    "avishkar@example.com",
                    "+91 98765 43210",
                    passwordEncoder.encode("password123")
            );
            defaultUser = userRepository.save(defaultUser);
            System.out.println(">> Seeded default user: Avishkar (MED-1001 / password123)");
        } else {
            defaultUser = userRepository.findAll().get(0);
        }

        // 2. Initial Doctors
        if (doctorRepository.count() == 0) {
            doctorRepository.saveAll(List.of(
                    new Doctor("Dr. Priya Sharma", "General Physician", "Online", "PS"),
                    new Doctor("Dr. Amit Patel", "Cardiologist", "Offline", "AM"),
                    new Doctor("Dr. Sneha Kulkarni", "Gynecologist", "Online", "SK")
            ));
            System.out.println(">> Seeded 3 doctors");
        }

        // 3. Initial Medicines
        if (medicineRepository.count() == 0) {
            medicineRepository.saveAll(List.of(
                    new Medicine(defaultUser, "Paracetamol 500mg", "1 tablet after food", "08:00 AM", true),
                    new Medicine(defaultUser, "Vitamin D3", "1 tablet (once daily)", "09:00 AM", true),
                    new Medicine(defaultUser, "Iron Tablet", "1 tablet after food", "01:00 PM", true),
                    new Medicine(defaultUser, "Calcium Tablet", "1 tablet at night", "08:00 PM", true)
            ));
            System.out.println(">> Seeded 4 medicines");
        }

        // 4. Initial Medical Reports
        if (reportRepository.count() == 0) {
            reportRepository.saveAll(List.of(
                    new MedicalReport(defaultUser, "Blood Test Report", "Blood Test", "12 Sep 2026", "City Diagnostic Lab", "Reviewed", "blood-test.pdf", null, "1.2 MB", "Complete blood count and lipid panel within normal limits."),
                    new MedicalReport(defaultUser, "X-Ray (Chest)", "X-Ray", "01 Aug 2026", "Metro Imaging Centre", "Reviewed", "chest-xray.jpg", null, "2.4 MB", "Lungs clear, normal cardiothoracic ratio."),
                    new MedicalReport(defaultUser, "ECG Report", "ECG", "15 Jul 2026", "Dr. Mehta", "Reviewed", "ecg-report.pdf", null, "840 KB", "Normal sinus rhythm at 72 bpm."),
                    new MedicalReport(defaultUser, "Prescription", "Prescription", "10 Jul 2026", "Dr. Mehta", "Pending", "prescription.pdf", null, "540 KB", "Prescription for seasonal allergies and vitamins.")
            ));
            System.out.println(">> Seeded 4 medical reports");
        }

        // 5. Initial Nearby Medical Services
        if (serviceRepository.count() == 0) {
            serviceRepository.saveAll(List.of(
                    new MedicalServiceEntity("City Care Hospital", "Hospital", "2.1 km", "+91 20 5550 0100", "Multispecialty Healthcare Centre, Main St", "🏥"),
                    new MedicalServiceEntity("Shree Medical Store", "Medical Store", "1.5 km", "+91 20 5550 0101", "Near College Road, Market Yard", "💊"),
                    new MedicalServiceEntity("ABC Diagnostic Lab", "Diagnostic Lab", "2.5 km", "+91 20 5550 0102", "Pathology & Blood Tests Centre, Station Road", "🧪"),
                    new MedicalServiceEntity("Life Care Hospital", "Hospital", "3.0 km", "+91 20 5550 0103", "General & Emergency Hospital, Ring Road", "🏥")
            ));
            System.out.println(">> Seeded 4 nearby medical services");
        }

        // 6. Initial Health Videos
        if (videoRepository.count() == 0) {
            videoRepository.saveAll(List.of(
                    new HealthVideo("How to take medicines correctly", "Medicine Usage", "05:30 min", "Health education", null, "💊"),
                    new HealthVideo("Breathing Exercises for Better Health", "Exercise", "07:12 min", "Health education", null, "🧘"),
                    new HealthVideo("Healthy Diet Plan", "Diet & Nutrition", "06:20 min", "Health education", null, "🥗"),
                    new HealthVideo("Post-Surgery Care Tips", "General Health", "04:15 min", "Health education", null, "🛏️"),
                    new HealthVideo("Diabetes Care Guide", "General Health", "08:10 min", "Health education", null, "🩸"),
                    new HealthVideo("Women's Health Tips", "General Health", "07:25 min", "Health education", null, "👩‍⚕️")
            ));
            System.out.println(">> Seeded 6 health videos");
        }

        // 7. Initial Chat Messages
        if (chatMessageRepository.count() == 0) {
            chatMessageRepository.saveAll(List.of(
                    new ChatMessage(defaultUser, "doctor", "Dr. Priya Sharma", "Hello Avishkar, how are you feeling today?"),
                    new ChatMessage(defaultUser, "patient", "Dr. Priya Sharma", "Hello Doctor. I have a question about my medicine.")
            ));
            System.out.println(">> Seeded initial doctor-patient chat");
        }

        // 8. Initial Progress Log
        if (progressLogRepository.count() == 0) {
            progressLogRepository.save(new ProgressLog(
                    defaultUser,
                    "2026-10-12",
                    72.0,
                    "Good",
                    "3 of 3 planned",
                    "2.5 litres",
                    30,
                    8000,
                    "120/80",
                    11.2
            ));
            System.out.println(">> Seeded initial progress log");
        }
    }
}
