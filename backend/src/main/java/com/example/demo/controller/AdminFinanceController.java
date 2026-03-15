package com.example.demo.controller;

import com.example.demo.repository.BookingRepository;
import com.example.demo.model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/finance")
@PreAuthorize("hasRole('ADMIN')")
public class AdminFinanceController {

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getFinanceStats() {
        List<Booking> allBookings = bookingRepository.findAll();
        
        double totalRevenue = allBookings.stream()
            .filter(b -> "completed".equals(b.getConsultationStatus()))
            .mapToDouble(Booking::getFee)
            .sum();

        long totalConsultations = allBookings.stream()
            .filter(b -> "completed".equals(b.getConsultationStatus()))
            .count();

        // Group revenue by month
        Map<String, Double> monthlyRevenue = allBookings.stream()
            .filter(b -> "completed".equals(b.getConsultationStatus()))
            .collect(Collectors.groupingBy(
                b -> b.getCreatedAt().getMonth().name().substring(0, 3),
                Collectors.summingDouble(Booking::getFee)
            ));

        // Get recent transactions
        List<Map<String, Object>> recentTransactions = allBookings.stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .limit(5)
            .map(b -> {
                Map<String, Object> map = new HashMap<>();
                map.put("service", "Consultation - " + b.getDoctor());
                map.put("amount", b.getFee());
                map.put("date", b.getCreatedAt());
                map.put("status", b.getConsultationStatus());
                return map;
            })
            .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalConsultations", totalConsultations);
        stats.put("pendingRevenue", allBookings.stream()
            .filter(b -> !"completed".equals(b.getConsultationStatus()))
            .mapToDouble(Booking::getFee)
            .sum());
        stats.put("monthlyRevenue", monthlyRevenue);
        stats.put("recentTransactions", recentTransactions);
        
        return ResponseEntity.ok(stats);
    }
}
