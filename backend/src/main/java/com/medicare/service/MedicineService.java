package com.medicare.service;

import com.medicare.dto.MedicineRequest;
import com.medicare.entity.Medicine;
import com.medicare.entity.User;
import com.medicare.repository.MedicineRepository;
import com.medicare.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;

    public MedicineService(MedicineRepository medicineRepository, UserRepository userRepository) {
        this.medicineRepository = medicineRepository;
        this.userRepository = userRepository;
    }

    public List<Medicine> getMedicines(Long userId) {
        if (userId != null) {
            List<Medicine> list = medicineRepository.findByUserIdOrderByIdAsc(userId);
            if (!list.isEmpty()) return list;
        }
        return medicineRepository.findAll();
    }

    @Transactional
    public Medicine addMedicine(MedicineRequest request) {
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }
        if (user == null) {
            user = userRepository.findAll().stream().findFirst().orElse(null);
        }

        // Format time nicely if 24hr string like "08:00" -> "08:00 AM"
        String formattedTime = formatTime(request.getTime());

        Medicine medicine = new Medicine(
                user,
                request.getName().trim(),
                request.getDose().trim(),
                formattedTime,
                request.isReminderActive()
        );

        return medicineRepository.save(medicine);
    }

    @Transactional
    public Optional<Medicine> toggleReminder(Long id) {
        return medicineRepository.findById(id).map(med -> {
            med.setReminderActive(!med.isReminderActive());
            return medicineRepository.save(med);
        });
    }

    @Transactional
    public boolean deleteMedicine(Long id) {
        if (medicineRepository.existsById(id)) {
            medicineRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Map<String, Object> getStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        long total = userId != null ? medicineRepository.countByUserId(userId) : medicineRepository.count();
        if (total == 0) total = medicineRepository.count();

        long active = userId != null ? medicineRepository.countByUserIdAndReminderActiveTrue(userId) : medicineRepository.countByReminderActiveTrue();
        if (active == 0) active = medicineRepository.countByReminderActiveTrue();

        stats.put("total", total);
        stats.put("activeReminders", active);
        stats.put("status", active > 0 ? "Active" : "Paused");
        return stats;
    }

    private String formatTime(String time) {
        if (time == null || time.isBlank()) return "08:00 AM";
        if (time.toUpperCase().contains("AM") || time.toUpperCase().contains("PM")) {
            return time;
        }
        try {
            String[] parts = time.split(":");
            int hour = Integer.parseInt(parts[0]);
            int minute = Integer.parseInt(parts[1]);
            String ampm = hour >= 12 ? "PM" : "AM";
            int h12 = hour % 12;
            if (h12 == 0) h12 = 12;
            return String.format("%02d:%02d %s", h12, minute, ampm);
        } catch (Exception e) {
            return time;
        }
    }
}
