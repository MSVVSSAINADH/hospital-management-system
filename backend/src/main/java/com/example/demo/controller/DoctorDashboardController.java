package com.example.demo.controller;

import com.example.demo.model.Booking;
import com.example.demo.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctor/dashboard")
public class DoctorDashboardController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/patient-queue/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> getTodayQueue(@PathVariable Long doctorId, @RequestParam(required = false) String doctorName) {
        List<Booking> allBookings = bookingService.getBookingsByDoctorId(doctorId);
        System.out.println("DEBUG: Dashboard fetch for Doctor ID: " + doctorId + ". Appointments found: " + (allBookings != null ? allBookings.size() : 0));
        
        // Fallback to name-based matching for legacy data if ID-based matching returns nothing
        if (allBookings == null || allBookings.isEmpty()) {
            if (doctorName != null && !doctorName.isEmpty()) {
                System.out.println("DEBUG: No ID-based bookings found. Falling back to Name: " + doctorName);
                allBookings = bookingService.getBookingsByDoctor(doctorName);
            }
        }

        if (allBookings == null) return ResponseEntity.ok(java.util.Collections.emptyList());

        // Filter for active statuses (show all upcoming/current/recently completed, not just today)
        List<Booking> queue = allBookings.stream()
            .filter(b -> !b.getStatus().equals("cancelled"))
            .collect(Collectors.toList());

        return ResponseEntity.ok(queue);
    }

    @PatchMapping("/booking/{id}/status")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> updateConsultationStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Booking booking = bookingService.updateConsultationStatus(id, status);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
