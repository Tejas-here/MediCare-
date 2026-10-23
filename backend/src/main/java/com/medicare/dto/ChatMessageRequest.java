package com.medicare.dto;

import jakarta.validation.constraints.NotBlank;

public class ChatMessageRequest {

    private Long userId;

    private String sender = "patient";

    @NotBlank(message = "Doctor name is required")
    private String doctorName;

    @NotBlank(message = "Message text is required")
    private String message;

    public ChatMessageRequest() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
