package com.example.demo.controller;

import com.example.demo.entity.MedicalRecord;
import com.example.demo.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private com.example.demo.repository.UserRepository userRepository;

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'DOCTOR')")
    public ResponseEntity<List<MedicalRecord>> getRecordsByPatient(@PathVariable Long patientId, org.springframework.security.core.Authentication authentication) {
        // ✅ IDOR Protection: Users can only see their own records
        String currentUsername = authentication.getName();
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_DOCTOR"));
        
        if (!isStaff) {
            java.util.Optional<com.example.demo.entity.User> currentUser = userRepository.findByUsername(currentUsername);
            if (currentUser.isEmpty() || !currentUser.get().getId().equals(patientId)) {
                return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
            }
        }
        
        return ResponseEntity.ok(medicalRecordService.getRecordsByPatientId(patientId));
    }
}
