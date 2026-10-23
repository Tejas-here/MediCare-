package com.medicare.dto;

public class AuthResponse {

    private boolean success;
    private String message;
    private Long id;
    private String patientId;
    private String fullName;
    private String email;
    private String phone;

    public AuthResponse() {}

    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public AuthResponse(boolean success, String message, Long id, String patientId, String fullName, String email, String phone) {
        this.success = success;
        this.message = message;
        this.id = id;
        this.patientId = patientId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
