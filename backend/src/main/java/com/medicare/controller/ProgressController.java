package com.medicare.controller;

import com.medicare.dto.ProgressLogRequest;
import com.medicare.entity.ProgressLog;
import com.medicare.service.ProgressLogService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressController {

    private final ProgressLogService progressLogService;

    public ProgressController(ProgressLogService progressLogService) {
        this.progressLogService = progressLogService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(progressLogService.getLatestMetrics(userId));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ProgressLog>> getHistory(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(progressLogService.getLogs(userId));
    }

    @PostMapping("/log")
    public ResponseEntity<ProgressLog> saveLog(@Valid @RequestBody ProgressLogRequest request) {
        ProgressLog saved = progressLogService.saveLog(request);
        return ResponseEntity.ok(saved);
    }
}
