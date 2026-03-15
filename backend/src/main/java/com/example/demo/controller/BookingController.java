package com.example.demo.controller;

import com.example.demo.model.Booking;
import com.example.demo.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Endpoint to create a new booking
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        System.out.println("Received Booking Data: " + booking);
        try {
            Booking savedBooking = bookingService.createBooking(booking);
            return ResponseEntity.ok(savedBooking);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Autowired
    private com.example.demo.repository.UserRepository userRepository;

    // Endpoint to get bookings by user ID
    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable Long userId, org.springframework.security.core.Authentication authentication) {
        try {
            // ✅ Cross-user data access check (Security Loophole Fix)
            String currentUsername = authentication.getName();
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
            if (!isAdmin) {
                java.util.Optional<com.example.demo.entity.User> currentUser = userRepository.findByUsername(currentUsername);
                if (currentUser.isEmpty() || !currentUser.get().getId().equals(userId)) {
                    return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
                }
            }

            List<Booking> bookings = bookingService.getBookingsByUserId(userId);
            if (bookings.isEmpty()) {
                return ResponseEntity.noContent().build(); // Return 204 if no bookings are found
            }
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build(); // Return 400 if something goes wrong
        }
    }

    // Endpoint to get all bookings (for admin purposes)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        try {
            List<Booking> bookings = bookingService.getAllBookings();
            if (bookings.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Endpoint to get bookings by doctor name
    @GetMapping("/doctor/{doctorName}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'USER')")
    public ResponseEntity<List<Booking>> getBookingsByDoctor(@PathVariable String doctorName) {
        try {
            List<Booking> bookings = bookingService.getBookingsByDoctor(doctorName);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Endpoint to get bookings by doctor ID
    @GetMapping("/by-doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'USER')")
    public ResponseEntity<List<Booking>> getBookingsByDoctorId(@PathVariable Long doctorId) {
        System.out.println("DEBUG: Fetching bookings for Doctor ID: " + doctorId);
        try {
            List<Booking> bookings = bookingService.getBookingsByDoctorId(doctorId);
            System.out.println("DEBUG: Found " + (bookings != null ? bookings.size() : 0) + " bookings for Doctor ID " + doctorId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            System.err.println("DEBUG: Error in getBookingsByDoctorId: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // Endpoint to cancel a booking
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        try {
            Booking cancelled = bookingService.cancelBooking(id);
            if (cancelled == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(cancelled);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
