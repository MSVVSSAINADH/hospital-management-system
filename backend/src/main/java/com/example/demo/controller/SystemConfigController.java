package com.example.demo.controller;

import com.example.demo.entity.SystemConfig;
import com.example.demo.repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/system-config")
public class SystemConfigController {

    @Autowired
    private SystemConfigRepository systemConfigRepository;

    @GetMapping
    public ResponseEntity<List<SystemConfig>> getAllConfig() {
        return ResponseEntity.ok(systemConfigRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemConfig> updateConfig(@RequestBody SystemConfig config) {
        return ResponseEntity.ok(systemConfigRepository.save(config));
    }

    @GetMapping("/{key}")
    public ResponseEntity<SystemConfig> getConfig(@PathVariable String key) {
        return systemConfigRepository.findById(key)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
