package com.medicare.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicines")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 150)
    private String dose;

    @Column(name = "reminder_time", nullable = false, length = 50)
    private String reminderTime;

    @Column(name = "reminder_active", nullable = false)
    private boolean reminderActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Medicine() {}

    public Medicine(User user, String name, String dose, String reminderTime, boolean reminderActive) {
        this.user = user;
        this.name = name;
        this.dose = dose;
        this.reminderTime = reminderTime;
        this.reminderActive = reminderActive;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDose() { return dose; }
    public void setDose(String dose) { this.dose = dose; }

    public String getReminderTime() { return reminderTime; }
    public void setReminderTime(String reminderTime) { this.reminderTime = reminderTime; }

    public boolean isReminderActive() { return reminderActive; }
    public void setReminderActive(boolean reminderActive) { this.reminderActive = reminderActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
