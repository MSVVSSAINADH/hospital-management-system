package com.example.demo.controller;

import com.example.demo.entity.Feedback;
import com.example.demo.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping
    public ResponseEntity<Feedback> createFeedback(@RequestBody Feedback feedback) {
        System.out.println("DEBUG: Creating Feedback for Doctor: " + feedback.getDoctorName() + " (ID: " + feedback.getDoctorId() + ")");
        Feedback saved = feedbackRepository.save(feedback);
        System.out.println("DEBUG: Feedback saved with ID: " + saved.getId());
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackRepository.findAll());
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Feedback>> getFeedbackByDoctor(@PathVariable Long doctorId) {
        // Simple filter for now, or add method to repository
        return ResponseEntity.ok(feedbackRepository.findAll().stream()
                .filter(f -> f.getDoctorId().equals(doctorId))
                .toList());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable Long id, @RequestBody Feedback updates) {
        return feedbackRepository.findById(id).map(f -> {
            if (updates.getStatus() != null) f.setStatus(updates.getStatus());
            if (updates.getAdminComment() != null) f.setAdminComment(updates.getAdminComment());
            return ResponseEntity.ok(feedbackRepository.save(f));
        }).orElse(ResponseEntity.notFound().build());
    }
}
