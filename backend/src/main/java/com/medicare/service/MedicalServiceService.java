package com.medicare.service;

import com.medicare.entity.MedicalServiceEntity;
import com.medicare.repository.MedicalServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalServiceService {

    private final MedicalServiceRepository serviceRepository;

    public MedicalServiceService(MedicalServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<MedicalServiceEntity> getAllServices(String filter, String search) {
        List<MedicalServiceEntity> list;
        if (filter != null && !filter.isBlank() && !filter.equalsIgnoreCase("All")) {
            // Normalize "Hospitals" -> "Hospital", "Medical Stores" -> "Medical Store", "Diagnostic Labs" -> "Diagnostic Lab"
            String normalized = filter.trim();
            if (normalized.endsWith("s")) {
                normalized = normalized.substring(0, normalized.length() - 1);
            }
            list = serviceRepository.findByServiceTypeIgnoreCase(normalized);
            if (list.isEmpty()) {
                list = serviceRepository.findAll();
            }
        } else {
            list = serviceRepository.findAll();
        }

        if (search != null && !search.isBlank()) {
            String q = search.trim().toLowerCase();
            return list.stream().filter(s ->
                    (s.getName() != null && s.getName().toLowerCase().contains(q)) ||
                    (s.getServiceType() != null && s.getServiceType().toLowerCase().contains(q)) ||
                    (s.getAddress() != null && s.getAddress().toLowerCase().contains(q))
            ).toList();
        }

        return list;
    }
}
