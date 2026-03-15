package com.example.demo.controller;

import com.example.demo.entity.Announcement;
import com.example.demo.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/broadcasts")
public class AnnouncementController {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @PostMapping("/send")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Announcement> createAnnouncement(@RequestBody Announcement announcement) {
        return ResponseEntity.ok(announcementRepository.save(announcement));
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        announcementRepository.findById(id).ifPresent(ann -> {
            ann.setActive(false);
            announcementRepository.save(ann);
        });
        return ResponseEntity.noContent().build();
    }
}
