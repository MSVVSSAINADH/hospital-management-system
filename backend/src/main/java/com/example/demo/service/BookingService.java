package com.example.demo.service;

import com.example.demo.model.Booking;
import com.example.demo.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private com.example.demo.repository.DoctorAvailabilityRepository availabilityRepository;

    @Autowired
    private com.example.demo.repository.DoctorScheduleRepository scheduleRepository;

    @Autowired
    private com.example.demo.repository.DoctorRepository doctorRepository;

    // Create a new booking
    @jakarta.transaction.Transactional
    public Booking createBooking(Booking booking) {
        // 0. Verify Doctor Status (Security/Logic Fix)
        com.example.demo.entity.Doctor doctor = doctorRepository.findById(booking.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found."));
        
        if (doctor.getStatus() != com.example.demo.entity.Doctor.Status.ACTIVE || doctor.isDeleted()) {
            throw new RuntimeException("This doctor is currently unavailable or no longer active.");
        }

        // 1. Check Admin Blocks (DoctorAvailability)
        boolean isAdminBlocked = availabilityRepository.findByDoctorIdAndDateAndIsBookedFalse(booking.getDoctorId(), booking.getDate())
                .stream()
                .anyMatch(a -> a.getTimeSlot().equals(booking.getTimeSlot()) && "UNAVAILABLE".equals(a.getStatus()));
        
        if (isAdminBlocked) {
            throw new RuntimeException("Selected time slot is blocked by administration.");
        }

        // 2. Check Doctor Blocks (DoctorSchedule)
        java.util.Optional<com.example.demo.model.DoctorSchedule> scheduleOpt = scheduleRepository.findByDoctorNameAndDate(booking.getDoctor(), booking.getDate());
        if (scheduleOpt.isPresent() && scheduleOpt.get().getBlockedSlots() != null) {
            if (scheduleOpt.get().getBlockedSlots().contains(booking.getTimeSlot())) {
                throw new RuntimeException("This slot has been marked as unavailable by the doctor.");
            }
        }

        if (booking.getAvailabilityId() != null) {
            availabilityRepository.findById(booking.getAvailabilityId()).ifPresent(availability -> {
                availability.setBooked(true);
                availabilityRepository.save(availability);
            });
        }
        return bookingRepository.save(booking);
    }

    // Retrieve bookings by user ID
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    // Retrieve bookings by doctor name
    public List<Booking> getBookingsByDoctor(String doctorName) {
        return bookingRepository.findByDoctor(doctorName);
    }

    // Retrieve bookings by doctor ID
    public List<Booking> getBookingsByDoctorId(Long doctorId) {
        return bookingRepository.findByDoctorId(doctorId);
    }

    // Retrieve all bookings (for admin purposes)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Cancel a booking
    public Booking cancelBooking(Long id) {
        java.util.Optional<Booking> optBooking = bookingRepository.findById(id);
        if (optBooking.isPresent()) {
            Booking booking = optBooking.get();
            booking.setStatus("cancelled");
            booking.setUpdatedAt(java.time.LocalDateTime.now());
            return bookingRepository.save(booking);
        }
        return null;
    }

    // Update consultation status
    public Booking updateConsultationStatus(Long id, String status) {
        java.util.Optional<Booking> optBooking = bookingRepository.findById(id);
        if (optBooking.isPresent()) {
            Booking booking = optBooking.get();
            booking.setConsultationStatus(status);
            if ("completed".equalsIgnoreCase(status)) {
                booking.setStatus("completed");
            }
            booking.setUpdatedAt(java.time.LocalDateTime.now());
            return bookingRepository.save(booking);
        }
        return null;
    }
}
