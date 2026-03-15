package com.example.demo.controller;

import com.example.demo.model.DoctorSchedule;
import com.example.demo.service.DoctorScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctor-schedule")

public class DoctorScheduleController {

    @Autowired
    private DoctorScheduleService scheduleService;

    @PostMapping("/save")
    public DoctorSchedule saveSchedule(@RequestBody DoctorSchedule schedule) {
        return scheduleService.saveSchedule(schedule);
    }

    @GetMapping("/{doctorName}/{date}")
    public Optional<DoctorSchedule> getSchedule(@PathVariable String doctorName, @PathVariable String date) {
        return scheduleService.getSchedule(doctorName, date);
    }

    @GetMapping("/available")
    public List<String> getAvailableDoctors(@RequestParam String date) {
        return scheduleService.getAvailableDoctors(date);
    }
}
