package com.medicare.service;

import com.medicare.dto.ProgressLogRequest;
import com.medicare.entity.ProgressLog;
import com.medicare.entity.User;
import com.medicare.repository.ProgressLogRepository;
import com.medicare.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProgressLogService {

    private final ProgressLogRepository progressLogRepository;
    private final UserRepository userRepository;

    public ProgressLogService(ProgressLogRepository progressLogRepository, UserRepository userRepository) {
        this.progressLogRepository = progressLogRepository;
        this.userRepository = userRepository;
    }

    public List<ProgressLog> getLogs(Long userId) {
        if (userId != null) {
            List<ProgressLog> list = progressLogRepository.findByUserIdOrderByLogDateAsc(userId);
            if (!list.isEmpty()) return list;
        }
        return progressLogRepository.findAll();
    }

    @Transactional
    public ProgressLog saveLog(ProgressLogRequest request) {
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }
        if (user == null) {
            user = userRepository.findAll().stream().findFirst().orElse(null);
        }

        String logDate = request.getDate();
        if (logDate == null || logDate.isBlank()) {
            logDate = LocalDate.now().format(DateTimeFormatter.ISO_DATE);
        }

        ProgressLog log = new ProgressLog(
                user,
                logDate,
                request.getWeight(),
                request.getFeel() != null ? request.getFeel() : "Good",
                request.getMedicinesTaken() != null ? request.getMedicinesTaken() : "3 of 3 planned",
                request.getWaterIntake() != null ? request.getWaterIntake() : "2.5 litres",
                request.getExerciseMinutes() != null ? request.getExerciseMinutes() : 30,
                request.getStepsToday() != null ? request.getStepsToday() : 8000,
                request.getBloodPressure() != null ? request.getBloodPressure() : "120/80",
                request.getHemoglobin() != null ? request.getHemoglobin() : 11.2
        );

        return progressLogRepository.save(log);
    }

    public Map<String, Object> getLatestMetrics(Long userId) {
        Map<String, Object> metrics = new HashMap<>();

        Optional<ProgressLog> latestOpt = userId != null
                ? progressLogRepository.findFirstByUserIdOrderByLogDateDesc(userId)
                : progressLogRepository.findFirstByOrderByLogDateDesc();

        if (latestOpt.isPresent()) {
            ProgressLog p = latestOpt.get();
            metrics.put("weight", p.getWeightKg() + " kg");
            metrics.put("bloodPressure", p.getBloodPressure());
            metrics.put("hemoglobin", p.getHemoglobin() != null ? p.getHemoglobin().toString() : "11.2");
            metrics.put("stepsToday", p.getStepsToday() != null ? String.format("%,d", p.getStepsToday()) : "8,000");
            metrics.put("feeling", p.getFeeling());
            metrics.put("medicinesTaken", p.getMedicinesTaken());
            metrics.put("waterIntake", p.getWaterIntake());
            metrics.put("exerciseMinutes", p.getExerciseMinutes());
        } else {
            metrics.put("weight", "72 kg");
            metrics.put("bloodPressure", "120/80");
            metrics.put("hemoglobin", "11.2");
            metrics.put("stepsToday", "8,000");
            metrics.put("feeling", "Good");
            metrics.put("medicinesTaken", "3 of 3 planned");
            metrics.put("waterIntake", "2.5 litres");
            metrics.put("exerciseMinutes", 30);
        }

        return metrics;
    }
}
