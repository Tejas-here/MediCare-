package com.medicare.controller;

import com.medicare.dto.AuthResponse;
import com.medicare.dto.LoginRequest;
import com.medicare.dto.RegisterRequest;
import com.medicare.entity.User;
import com.medicare.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam(required = false) Long userId,
                                        @RequestParam(required = false) String email,
                                        @RequestParam(required = false) String patientId) {
        User user = null;
        if (userId != null) {
            user = userService.findById(userId).orElse(null);
        } else if (email != null && !email.isBlank()) {
            user = userService.findByEmail(email).orElse(null);
        } else if (patientId != null && !patientId.isBlank()) {
            user = userService.findByPatientId(patientId).orElse(null);
        }

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("patientId", user.getPatientId());
        map.put("fullName", user.getFullName());
        map.put("email", user.getEmail());
        map.put("phone", user.getPhone());
        map.put("createdAt", user.getCreatedAt());
        return ResponseEntity.ok(map);
    }
}
