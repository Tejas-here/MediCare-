package com.medicare.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "health_videos")
public class HealthVideo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 100)
    private String category; // "Medicine Usage", "Exercise", "Diet & Nutrition", "General Health"

    @Column(nullable = false, length = 50)
    private String duration;

    @Column(nullable = false, length = 100)
    private String tag = "Health education";

    @Column(name = "video_url")
    private String videoUrl;

    @Column(nullable = false, length = 20)
    private String icon = "▶";

    public HealthVideo() {}

    public HealthVideo(String title, String category, String duration, String tag, String videoUrl, String icon) {
        this.title = title;
        this.category = category;
        this.duration = duration;
        this.tag = tag;
        this.videoUrl = videoUrl;
        this.icon = icon;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
