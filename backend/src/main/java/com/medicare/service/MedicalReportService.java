package com.medicare.service;

import com.medicare.entity.MedicalReport;
import com.medicare.entity.User;
import com.medicare.repository.MedicalReportRepository;
import com.medicare.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MedicalReportService {

    private final MedicalReportRepository reportRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public MedicalReportService(MedicalReportRepository reportRepository, UserRepository userRepository, FileStorageService fileStorageService) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public List<MedicalReport> getAllReports(Long userId, String category, String search) {
        List<MedicalReport> list;
        if (userId != null) {
            if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All") && !category.equalsIgnoreCase("All Reports")) {
                list = reportRepository.findByUserIdAndCategoryIgnoreCase(userId, category);
            } else {
                list = reportRepository.findByUserIdOrderByIdDesc(userId);
            }
        } else {
            if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All") && !category.equalsIgnoreCase("All Reports")) {
                list = reportRepository.findByCategoryIgnoreCase(category);
            } else {
                list = reportRepository.findAll();
            }
        }

        if (search != null && !search.isBlank()) {
            String q = search.trim().toLowerCase();
            return list.stream().filter(r ->
                    (r.getReportName() != null && r.getReportName().toLowerCase().contains(q)) ||
                    (r.getCategory() != null && r.getCategory().toLowerCase().contains(q)) ||
                    (r.getDoctorOrLab() != null && r.getDoctorOrLab().toLowerCase().contains(q)) ||
                    (r.getNotes() != null && r.getNotes().toLowerCase().contains(q))
            ).toList();
        }

        return list;
    }

    public Optional<MedicalReport> getReportById(Long id) {
        return reportRepository.findById(id);
    }

    @Transactional
    public MedicalReport createReport(Long userId, String reportName, String category, String reportDate, String doctorOrLab, String notes, MultipartFile file) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }
        if (user == null) {
            // Default to first user or demo
            user = userRepository.findAll().stream().findFirst().orElse(null);
        }

        String storedFileName = null;
        String originalFileName = null;
        String fileSizeStr = "1.0 MB";

        if (file != null && !file.isEmpty()) {
            originalFileName = file.getOriginalFilename();
            storedFileName = fileStorageService.storeFile(file);
            long bytes = file.getSize();
            if (bytes > 1024 * 1024) {
                fileSizeStr = String.format("%.1f MB", bytes / (1024.0 * 1024.0));
            } else {
                fileSizeStr = String.format("%d KB", bytes / 1024);
            }
        }

        if (reportDate == null || reportDate.isBlank()) {
            reportDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
        }

        MedicalReport report = new MedicalReport(
                user,
                reportName.trim(),
                category.trim(),
                reportDate,
                doctorOrLab != null && !doctorOrLab.isBlank() ? doctorOrLab.trim() : "Healthcare Clinic",
                "Reviewed",
                originalFileName != null ? originalFileName : "document.pdf",
                storedFileName,
                fileSizeStr,
                notes
        );

        return reportRepository.save(report);
    }

    @Transactional
    public boolean deleteReport(Long id) {
        Optional<MedicalReport> opt = reportRepository.findById(id);
        if (opt.isPresent()) {
            MedicalReport report = opt.get();
            if (report.getFilePath() != null) {
                fileStorageService.deleteFile(report.getFilePath());
            }
            reportRepository.delete(report);
            return true;
        }
        return false;
    }

    public Map<String, Object> getStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        long total = userId != null ? reportRepository.countByUserId(userId) : reportRepository.count();
        long reviewed = userId != null ? reportRepository.countByUserIdAndStatusIgnoreCase(userId, "Reviewed") : reportRepository.countByStatusIgnoreCase("Reviewed");

        List<MedicalReport> all = getAllReports(userId, null, null);
        String latest = all.isEmpty() ? "None" : all.get(0).getReportDate();

        stats.put("total", total);
        stats.put("reviewed", reviewed);
        stats.put("latest", latest);
        return stats;
    }

    public String generateCsv(Long userId) {
        List<MedicalReport> reports = getAllReports(userId, null, null);
        StringBuilder sb = new StringBuilder();
        sb.append("\"REPORT NAME\",\"CATEGORY\",\"DATE\",\"DOCTOR / LAB\",\"STATUS\",\"FILE\",\"NOTES\"\r\n");

        for (MedicalReport r : reports) {
            sb.append("\"").append(escapeCsv(r.getReportName())).append("\",")
              .append("\"").append(escapeCsv(r.getCategory())).append("\",")
              .append("\"").append(escapeCsv(r.getReportDate())).append("\",")
              .append("\"").append(escapeCsv(r.getDoctorOrLab())).append("\",")
              .append("\"").append(escapeCsv(r.getStatus())).append("\",")
              .append("\"").append(escapeCsv(r.getFileName())).append("\",")
              .append("\"").append(escapeCsv(r.getNotes())).append("\"\r\n");
        }
        return sb.toString();
    }

    private String escapeCsv(String str) {
        if (str == null) return "";
        return str.replace("\"", "\"\"");
    }
}
