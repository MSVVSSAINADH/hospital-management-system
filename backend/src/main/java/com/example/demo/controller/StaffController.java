package com.example.demo.controller;

import com.example.demo.entity.Staff;
import com.example.demo.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasRole('ADMIN')") // Secures all endpoints in this controller
public class StaffController {

    @Autowired
    private StaffService staffService;

    // Get staff (active or deleted based on query param)
    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff(@RequestParam(required = false) Boolean showDeleted) {
        if (Boolean.TRUE.equals(showDeleted)) {
            return ResponseEntity.ok(staffService.getAllDeletedStaff());
        } else {
            return ResponseEntity.ok(staffService.getAllStaff());
        }
    }

    // Add new staff
    @PostMapping
    public ResponseEntity<Staff> addStaff(@RequestBody Staff staff) {
        return ResponseEntity.ok(staffService.addStaff(staff));
    }

    // Toggle workToday status
    @PatchMapping("/{id}")
    public ResponseEntity<Staff> toggleWorkStatus(@PathVariable Long id, @RequestBody Staff staff) {
        Staff updatedStaff = staffService.updateStaffStatus(id, staff.isWorkToday());
        if (updatedStaff != null) {
            return ResponseEntity.ok(updatedStaff);
        }
        return ResponseEntity.notFound().build();
    }

    // Update staff details
    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable Long id, @RequestBody Staff staff) {
        Staff updated = staffService.updateStaff(id, staff);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    // Soft delete staff
    @PatchMapping("/{id}/delete")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        staffService.softDeleteStaff(id);
        return ResponseEntity.ok().build();
    }

    // Restore staff
    @PatchMapping("/{id}/restore")
    public ResponseEntity<Void> restore(@PathVariable Long id) {
        staffService.restoreStaff(id);
        return ResponseEntity.ok().build();
    }
}
