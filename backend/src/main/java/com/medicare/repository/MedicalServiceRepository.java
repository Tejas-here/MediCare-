package com.medicare.repository;

import com.medicare.entity.MedicalServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalServiceRepository extends JpaRepository<MedicalServiceEntity, Long> {
    List<MedicalServiceEntity> findByServiceTypeIgnoreCase(String serviceType);
}
