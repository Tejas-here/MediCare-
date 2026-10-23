package com.medicare.controller;

import com.medicare.dto.AppointmentRequest;
import com.medicare.dto.ChatMessageRequest;
import com.medicare.entity.Appointment;
import com.medicare.entity.ChatMessage;
import com.medicare.entity.Doctor;
import com.medicare.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @PostMapping("/appointments")
    public ResponseEntity<Appointment> bookAppointment(@Valid @RequestBody AppointmentRequest request) {
        Appointment saved = doctorService.bookAppointment(request);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAppointments(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(doctorService.getAppointments(userId));
    }

    @GetMapping("/chat")
    public ResponseEntity<List<ChatMessage>> getChatMessages(
            @RequestParam(required = false, defaultValue = "Dr. Priya Sharma") String doctor,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(doctorService.getChatMessages(doctor, userId));
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatMessage> sendChatMessage(@Valid @RequestBody ChatMessageRequest request) {
        ChatMessage saved = doctorService.sendChatMessage(request);
        return ResponseEntity.ok(saved);
    }
}
