package com.medicare.controller;

import com.medicare.entity.HealthVideo;
import com.medicare.service.HealthVideoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@CrossOrigin(origins = "*")
public class VideoController {

    private final HealthVideoService videoService;

    public VideoController(HealthVideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping
    public ResponseEntity<List<HealthVideo>> getVideos(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(videoService.getAllVideos(category, search));
    }
}
