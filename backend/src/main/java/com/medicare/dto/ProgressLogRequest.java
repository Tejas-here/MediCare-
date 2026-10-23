package com.medicare.dto;

import jakarta.validation.constraints.NotNull;

public class ProgressLogRequest {

    private Long userId;

    private String date;

    @NotNull(message = "Weight is required")
    private Double weight;

    private String feel = "Good";

    private String medicinesTaken = "3 of 3 planned";
    private String waterIntake = "2.5 litres";
    private Integer exerciseMinutes = 30;
    private Integer stepsToday = 8000;
    private String bloodPressure = "120/80";
    private Double hemoglobin = 11.2;

    public ProgressLogRequest() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public String getFeel() { return feel; }
    public void setFeel(String feel) { this.feel = feel; }

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
}
