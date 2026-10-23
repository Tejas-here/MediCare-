package com.medicare.service;

import com.medicare.dto.AuthResponse;
import com.medicare.dto.LoginRequest;
import com.medicare.dto.RegisterRequest;
import com.medicare.entity.User;
import com.medicare.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Random;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "An account with this email already exists.");
        }

        // Generate a friendly unique patient ID like MED-1042
        String patientId = generateUniquePatientId();

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(
                patientId,
                request.getFullName().trim(),
                request.getEmail().trim().toLowerCase(),
                request.getPhone().trim(),
                encodedPassword
        );

        User saved = userRepository.save(user);

        return new AuthResponse(
                true,
                "Account created successfully!",
                saved.getId(),
                saved.getPatientId(),
                saved.getFullName(),
                saved.getEmail(),
                saved.getPhone()
        );
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier();
        if (identifier == null || identifier.isBlank()) {
            identifier = request.getPatientId();
        }
        if (identifier == null || identifier.isBlank()) {
            return new AuthResponse(false, "Please provide your Email, Patient ID, or Phone number.");
        }

        identifier = identifier.trim();

        // Search by email, patientId, or phone
        Optional<User> userOpt = userRepository.findByEmailOrPatientIdOrPhone(
                identifier.toLowerCase(),
                identifier.toUpperCase(),
                identifier
        );

        if (userOpt.isEmpty()) {
            // Also try exact identifier match on all 3
            userOpt = userRepository.findByEmail(identifier.toLowerCase());
            if (userOpt.isEmpty()) {
                userOpt = userRepository.findByPatientId(identifier);
            }
        }

        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "User not found with provided identifier.");
        }

        User user = userOpt.get();

        // Check password (supports BCrypt as well as fallback plain text for initial demo test accounts)
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword())
                || request.getPassword().equals(user.getPassword());

        if (!passwordMatches) {
            return new AuthResponse(false, "Invalid credentials. Please check your password.");
        }

        return new AuthResponse(
                true,
                "Login successful!",
                user.getId(),
                user.getPatientId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone()
        );
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByPatientId(String patientId) {
        return userRepository.findByPatientId(patientId);
    }

    private String generateUniquePatientId() {
        Random random = new Random();
        for (int i = 0; i < 20; i++) {
            String candidate = "MED-" + (1000 + random.nextInt(9000));
            if (!userRepository.existsByPatientId(candidate)) {
                return candidate;
            }
        }
        return "MED-" + System.currentTimeMillis() % 100000;
    }
}
