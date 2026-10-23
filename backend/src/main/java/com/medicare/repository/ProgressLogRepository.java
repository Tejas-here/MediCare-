package com.medicare.repository;

import com.medicare.entity.ProgressLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressLogRepository extends JpaRepository<ProgressLog, Long> {
    List<ProgressLog> findByUserIdOrderByLogDateAsc(Long userId);
    Optional<ProgressLog> findFirstByUserIdOrderByLogDateDesc(Long userId);
    Optional<ProgressLog> findFirstByOrderByLogDateDesc();
}
