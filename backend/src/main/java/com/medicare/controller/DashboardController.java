package com.medicare.controller;

import com.medicare.entity.Appointment;
import com.medicare.entity.User;
import com.medicare.service.DoctorService;
import com.medicare.service.MedicalReportService;
import com.medicare.service.MedicineService;
import com.medicare.service.ProgressLogService;
import com.medicare.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final UserService userService;
    private final MedicalReportService reportService;
    private final MedicineService medicineService;
    private final DoctorService doctorService;
    private final ProgressLogService progressLogService;

    public DashboardController(UserService userService,
                               MedicalReportService reportService,
                               MedicineService medicineService,
                               DoctorService doctorService,
                               ProgressLogService progressLogService) {
        this.userService = userService;
        this.reportService = reportService;
        this.medicineService = medicineService;
        this.doctorService = doctorService;
        this.progressLogService = progressLogService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData(@RequestParam(required = false) Long userId) {
        Map<String, Object> data = new HashMap<>();

        User user = null;
        if (userId != null) {
            user = userService.findById(userId).orElse(null);
        }
        if (user == null) {
            user = userService.findById(1L).orElse(null);
        }

        if (user != null) {
            data.put("patientId", user.getPatientId());
            data.put("fullName", user.getFullName());
            data.put("email", user.getEmail());
        } else {
            data.put("patientId", "MED-1001");
            data.put("fullName", "Avishkar");
            data.put("email", "avishkar@example.com");
        }

        data.put("todayFormatted", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
        data.put("reportStats", reportService.getStats(userId));
        data.put("medicineStats", medicineService.getStats(userId));
        data.put("progressMetrics", progressLogService.getLatestMetrics(userId));

        List<Appointment> appts = doctorService.getAppointments(userId);
        if (!appts.isEmpty()) {
            data.put("nextAppointment", appts.get(0));
        } else {
            data.put("nextAppointment", Map.of("doctorName", "Dr. Priya Sharma", "appointmentDate", "15 Oct 2026", "timeSlot", "10:30 AM"));
        }

        return ResponseEntity.ok(data);
    }
}
