package com.example.demo.controller;

import com.example.demo.model.DoctorAvailability;
import com.example.demo.repository.DoctorAvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/availability")
public class DoctorAvailabilityController {

    @Autowired
    private DoctorAvailabilityRepository availabilityRepository;

    // Admin blocks multiple slots
    @PostMapping("/block/batch")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<DoctorAvailability>> blockSlotsBatch(@RequestBody List<DoctorAvailability> availabilities) {
        availabilities.forEach(a -> a.setStatus("UNAVAILABLE"));
        return ResponseEntity.ok(availabilityRepository.saveAll(availabilities));
    }

    // Get all availability records (Admin)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DoctorAvailability>> getAllAvailability() {
        return ResponseEntity.ok(availabilityRepository.findAll());
    }

    // Get blocked slots for a specific doctor and date (Patient/Admin)
    @GetMapping("/blocked")
    public ResponseEntity<List<DoctorAvailability>> getBlockedSlots(
            @RequestParam Long doctorId,
            @RequestParam String date) {
        return ResponseEntity.ok(availabilityRepository.findByDoctorIdAndDateAndIsBookedFalse(doctorId, date));
    }

    // Restore a slot (make it available again by deleting the block)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long id) {
        if (availabilityRepository.existsById(id)) {
            availabilityRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
