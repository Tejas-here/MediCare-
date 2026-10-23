package com.medicare.controller;

import com.medicare.entity.MedicalServiceEntity;
import com.medicare.service.MedicalServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class MedicalServiceController {

    private final MedicalServiceService serviceService;

    public MedicalServiceController(MedicalServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping
    public ResponseEntity<List<MedicalServiceEntity>> getServices(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(serviceService.getAllServices(type, search));
    }
}
