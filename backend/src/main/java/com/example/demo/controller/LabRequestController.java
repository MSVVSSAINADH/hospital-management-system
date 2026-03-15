package com.example.demo.controller;

import com.example.demo.entity.LabRequest;
import com.example.demo.repository.LabRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab-requests")
public class LabRequestController {

    @Autowired
    private LabRequestRepository labRequestRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LabRequest>> getAllRequests() {
        return ResponseEntity.ok(labRequestRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<LabRequest> createLabRequest(@RequestBody LabRequest request) {
        return ResponseEntity.ok(labRequestRepository.save(request));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'USER')")
    public ResponseEntity<List<LabRequest>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(labRequestRepository.findByPatientId(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<LabRequest>> getByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(labRequestRepository.findByDoctorId(doctorId));
    }

    @PatchMapping("/{id}/results")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LabRequest> uploadResults(@PathVariable Long id, @RequestBody String results) {
        return labRequestRepository.findById(id).map(req -> {
            req.setResults(results);
            req.setStatus("completed");
            req.setCompletedAt(java.time.LocalDateTime.now());
            return ResponseEntity.ok(labRequestRepository.save(req));
        }).orElse(ResponseEntity.notFound().build());
    }
}
