package com.medicare.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_reports")
public class MedicalReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "report_name", nullable = false, length = 200)
    private String reportName;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(name = "report_date", nullable = false, length = 50)
    private String reportDate;

    @Column(name = "doctor_or_lab", length = 150)
    private String doctorOrLab;

    @Column(nullable = false, length = 50)
    private String status = "Reviewed";

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "file_size", length = 50)
    private String fileSize;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public MedicalReport() {}

    public MedicalReport(User user, String reportName, String category, String reportDate, String doctorOrLab, String status, String fileName, String filePath, String fileSize, String notes) {
        this.user = user;
        this.reportName = reportName;
        this.category = category;
        this.reportDate = reportDate;
        this.doctorOrLab = doctorOrLab;
        this.status = status;
        this.fileName = fileName;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getReportName() { return reportName; }
    public void setReportName(String reportName) { this.reportName = reportName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getReportDate() { return reportDate; }
    public void setReportDate(String reportDate) { this.reportDate = reportDate; }

    public String getDoctorOrLab() { return doctorOrLab; }
    public void setDoctorOrLab(String doctorOrLab) { this.doctorOrLab = doctorOrLab; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getFileSize() { return fileSize; }
    public void setFileSize(String fileSize) { this.fileSize = fileSize; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
