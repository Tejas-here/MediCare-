package com.medicare.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    private String patientId;

    @NotBlank(message = "Email, Patient ID, or Phone is required")
    private String identifier; // can be email, patient ID, or phone

    @NotBlank(message = "Password is required")
    private String password;

    public LoginRequest() {}

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
