package com.medicare.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress_logs")
public class ProgressLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "log_date", nullable = false, length = 50)
    private String logDate;

    @Column(name = "weight_kg", nullable = false)
    private Double weightKg;

    @Column(nullable = false, length = 100)
    private String feeling; // "Good", "Okay", "Not feeling well"

    @Column(name = "medicines_taken", length = 100)
    private String medicinesTaken = "3 of 3 planned";

    @Column(name = "water_intake", length = 100)
    private String waterIntake = "2.5 litres";

    @Column(name = "exercise_minutes")
    private Integer exerciseMinutes = 30;

    @Column(name = "steps_today")
    private Integer stepsToday = 8000;

    @Column(name = "blood_pressure", length = 50)
    private String bloodPressure = "120/80";

    @Column(name = "hemoglobin")
    private Double hemoglobin = 11.2;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public ProgressLog() {}

    public ProgressLog(User user, String logDate, Double weightKg, String feeling, String medicinesTaken, String waterIntake, Integer exerciseMinutes, Integer stepsToday, String bloodPressure, Double hemoglobin) {
        this.user = user;
        this.logDate = logDate;
        this.weightKg = weightKg;
        this.feeling = feeling;
        this.medicinesTaken = medicinesTaken;
        this.waterIntake = waterIntake;
        this.exerciseMinutes = exerciseMinutes;
        this.stepsToday = stepsToday;
        this.bloodPressure = bloodPressure;
        this.hemoglobin = hemoglobin;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getLogDate() { return logDate; }
    public void setLogDate(String logDate) { this.logDate = logDate; }

    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }

    public String getFeeling() { return feeling; }
    public void setFeeling(String feeling) { this.feeling = feeling; }

    public String getMedicinesTaken() { return medicinesTaken; }
    public void setMedicinesTaken(String medicinesTaken) { this.medicinesTaken = medicinesTaken; }

    public String getWaterIntake() { return waterIntake; }
    public void setWaterIntake(String waterIntake) { this.waterIntake = waterIntake; }

    public Integer getExerciseMinutes() { return exerciseMinutes; }
    public void setExerciseMinutes(Integer exerciseMinutes) { this.exerciseMinutes = exerciseMinutes; }

    public Integer getStepsToday() { return stepsToday; }
    public void setStepsToday(Integer stepsToday) { this.stepsToday = stepsToday; }

    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }

    public Double getHemoglobin() { return hemoglobin; }
    public void setHemoglobin(Double hemoglobin) { this.hemoglobin = hemoglobin; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
