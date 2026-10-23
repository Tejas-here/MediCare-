package com.medicare.dto;

import jakarta.validation.constraints.NotBlank;

public class MedicineRequest {

    private Long userId;

    @NotBlank(message = "Medicine name is required")
    private String name;

    @NotBlank(message = "Dose is required")
    private String dose;

    @NotBlank(message = "Reminder time is required")
    private String time;

    private boolean reminderActive = true;

    public MedicineRequest() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDose() { return dose; }
    public void setDose(String dose) { this.dose = dose; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public boolean isReminderActive() { return reminderActive; }
    public void setReminderActive(boolean reminderActive) { this.reminderActive = reminderActive; }
}
