package com.medicare.dto;

import jakarta.validation.constraints.NotBlank;

public class AppointmentRequest {

    private Long userId;

    @NotBlank(message = "Doctor name is required")
    private String doctor;

    @NotBlank(message = "Appointment date is required")
    private String date;

    @NotBlank(message = "Time slot is required")
    private String time;

    public AppointmentRequest() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getDoctor() { return doctor; }
    public void setDoctor(String doctor) { this.doctor = doctor; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
}
