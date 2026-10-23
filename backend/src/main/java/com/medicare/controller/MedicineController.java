package com.medicare.controller;

import com.medicare.dto.MedicineRequest;
import com.medicare.entity.Medicine;
import com.medicare.service.MedicineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @GetMapping
    public ResponseEntity<List<Medicine>> getMedicines(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(medicineService.getMedicines(userId));
    }

    @PostMapping
    public ResponseEntity<Medicine> addMedicine(@Valid @RequestBody MedicineRequest request) {
        Medicine saved = medicineService.addMedicine(request);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<Medicine> toggleReminder(@PathVariable Long id) {
        return medicineService.toggleReminder(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteMedicine(@PathVariable Long id) {
        boolean deleted = medicineService.deleteMedicine(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Medicine deleted successfully"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(medicineService.getStats(userId));
    }
}
