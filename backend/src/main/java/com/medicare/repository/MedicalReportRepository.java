package com.medicare.repository;

import com.medicare.entity.MedicalReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalReportRepository extends JpaRepository<MedicalReport, Long> {
    List<MedicalReport> findByUserIdOrderByIdDesc(Long userId);
    List<MedicalReport> findByCategoryIgnoreCase(String category);
    List<MedicalReport> findByUserIdAndCategoryIgnoreCase(Long userId, String category);
    long countByUserId(Long userId);
    long countByUserIdAndStatusIgnoreCase(Long userId, String status);
    long countByStatusIgnoreCase(String status);
}
