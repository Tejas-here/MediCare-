package com.medicare.service;

import com.medicare.dto.AppointmentRequest;
import com.medicare.dto.ChatMessageRequest;
import com.medicare.entity.Appointment;
import com.medicare.entity.ChatMessage;
import com.medicare.entity.Doctor;
import com.medicare.entity.User;
import com.medicare.repository.AppointmentRepository;
import com.medicare.repository.ChatMessageRepository;
import com.medicare.repository.DoctorRepository;
import com.medicare.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    public DoctorService(DoctorRepository doctorRepository,
                         AppointmentRepository appointmentRepository,
                         ChatMessageRepository chatMessageRepository,
                         UserRepository userRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Transactional
    public Appointment bookAppointment(AppointmentRequest request) {
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }
        if (user == null) {
            user = userRepository.findAll().stream().findFirst().orElse(null);
        }

        Appointment appt = new Appointment(
                user,
                request.getDoctor(),
                request.getDate(),
                request.getTime(),
                "Confirmed"
        );

        return appointmentRepository.save(appt);
    }

    public List<Appointment> getAppointments(Long userId) {
        if (userId != null) {
            List<Appointment> list = appointmentRepository.findByUserIdOrderByIdDesc(userId);
            if (!list.isEmpty()) return list;
        }
        return appointmentRepository.findAll();
    }

    public List<ChatMessage> getChatMessages(String doctorName, Long userId) {
        if (doctorName == null || doctorName.isBlank()) {
            doctorName = "Dr. Priya Sharma";
        }
        return chatMessageRepository.findByDoctorNameOrderByCreatedAtAsc(doctorName);
    }

    @Transactional
    public ChatMessage sendChatMessage(ChatMessageRequest request) {
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }
        if (user == null) {
            user = userRepository.findAll().stream().findFirst().orElse(null);
        }

        String doctorName = request.getDoctorName() != null && !request.getDoctorName().isBlank()
                ? request.getDoctorName()
                : "Dr. Priya Sharma";

        ChatMessage msg = new ChatMessage(
                user,
                request.getSender() != null ? request.getSender() : "patient",
                doctorName,
                request.getMessage().trim()
        );

        return chatMessageRepository.save(msg);
    }
}
