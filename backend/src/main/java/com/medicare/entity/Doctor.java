package com.medicare.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 150)
    private String specialization;

    @Column(nullable = false, length = 50)
    private String status = "Online";

    @Column(name = "avatar_initials", nullable = false, length = 10)
    private String avatarInitials;

    public Doctor() {}

    public Doctor(String name, String specialization, String status, String avatarInitials) {
        this.name = name;
        this.specialization = specialization;
        this.status = status;
        this.avatarInitials = avatarInitials;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAvatarInitials() { return avatarInitials; }
    public void setAvatarInitials(String avatarInitials) { this.avatarInitials = avatarInitials; }
}
