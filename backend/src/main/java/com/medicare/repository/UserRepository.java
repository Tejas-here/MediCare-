package com.medicare.repository;

import com.medicare.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPatientId(String patientId);
    Optional<User> findByEmailOrPatientIdOrPhone(String email, String patientId, String phone);
    boolean existsByEmail(String email);
    boolean existsByPatientId(String patientId);
}
