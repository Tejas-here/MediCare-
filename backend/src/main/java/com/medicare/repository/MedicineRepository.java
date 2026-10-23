package com.medicare.repository;

import com.medicare.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByUserIdOrderByIdAsc(Long userId);
    long countByUserId(Long userId);
    long countByUserIdAndReminderActiveTrue(Long userId);
    long countByReminderActiveTrue();
}
