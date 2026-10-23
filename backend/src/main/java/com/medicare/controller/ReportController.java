package com.medicare.controller;

import com.medicare.entity.MedicalReport;
import com.medicare.service.FileStorageService;
import com.medicare.service.MedicalReportService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final MedicalReportService reportService;
    private final FileStorageService fileStorageService;

    public ReportController(MedicalReportService reportService, FileStorageService fileStorageService) {
        this.reportService = reportService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public ResponseEntity<List<MedicalReport>> getReports(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(reportService.getAllReports(userId, category, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalReport> getReportById(@PathVariable Long id) {
        return reportService.getReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<MedicalReport> createReport(
            @RequestParam(required = false) Long userId,
            @RequestParam("name") String name,
            @RequestParam("cat") String category,
            @RequestParam(value = "date", required = false) String date,
            @RequestParam(value = "who", required = false) String doctorOrLab,
            @RequestParam(value = "notes", required = false) String notes,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        MedicalReport saved = reportService.createReport(userId, name, category, date, doctorOrLab, notes, file);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteReport(@PathVariable Long id) {
        boolean deleted = reportService.deleteReport(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Report deleted successfully"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        MedicalReport report = reportService.getReportById(id).orElse(null);
        if (report == null || report.getFilePath() == null) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = fileStorageService.loadFileAsResource(report.getFilePath());
        String contentType = "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + report.getFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/export/csv")
    public ResponseEntity<String> exportCsv(@RequestParam(required = false) Long userId) {
        String csv = reportService.generateCsv(userId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"medicare-reports.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=utf-8"))
                .body(csv);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(reportService.getStats(userId));
    }
}
