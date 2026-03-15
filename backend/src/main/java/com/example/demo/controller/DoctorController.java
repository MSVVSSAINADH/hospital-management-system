package com.example.demo.controller;

import com.example.demo.entity.Doctor;
import com.example.demo.request.LoginRequest;
import com.example.demo.service.DoctorService;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping("/departments")
    public ResponseEntity<List<String>> getDepartments() {
        return ResponseEntity.ok(doctorRepository.findAll().stream()
                .map(d -> {
                    if (d.getDepartment() != null && !d.getDepartment().isEmpty()) return d.getDepartment();
                    return d.getSpecialization(); // Fallback to spec if dept is missing
                })
                .filter(d -> d != null && !d.isEmpty())
                .distinct()
                .toList());
    }

    @Autowired
    private JwtUtil jwtUtil;

    // Get doctors (active or deleted based on query param)
    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors(@RequestParam(required = false) Boolean showDeleted) {
        if (Boolean.TRUE.equals(showDeleted)) {
            return ResponseEntity.ok(doctorService.getDeletedDoctors());
        } else {
            return ResponseEntity.ok(doctorService.getAllDoctors());
        }
    }

    // Add new doctor
    @PostMapping
    public ResponseEntity<Doctor> addDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.addDoctor(doctor));
    }

    // Doctor Login
    @PostMapping("/login")
    public ResponseEntity<?> loginDoctor(@RequestBody LoginRequest loginRequest) {
        try {
            Doctor doctor = doctorService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            String token = jwtUtil.generateToken(doctor.getUsername(), "DOCTOR", doctor.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("doctor", doctor);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    // Update doctor status (ACTIVE/INACTIVE)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Doctor> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        String status = statusMap.get("status");
        Doctor updatedDoctor = doctorService.updateDoctorStatus(id, status);
        if (updatedDoctor != null) {
            return ResponseEntity.ok(updatedDoctor);
        }
        return ResponseEntity.notFound().build();
    }

    // Soft delete doctor
    @PatchMapping("/{id}/delete")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        doctorService.softDeleteDoctor(id);
        return ResponseEntity.ok().build();
    }

    // Restore doctor
    @PatchMapping("/{id}/restore")
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        doctorService.restoreDoctor(id);
        return ResponseEntity.ok().build();
    }
}
