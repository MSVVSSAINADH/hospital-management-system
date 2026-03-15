package com.example.demo.controller;

import com.example.demo.model.Appointment;
import com.example.demo.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/book")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Appointment bookAppointment(@RequestBody Appointment appointment) {
        return appointmentService.createAppointment(appointment);
    }

    @GetMapping("/doctor/{doctorName}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public List<Appointment> getAppointmentsByDoctor(@PathVariable String doctorName) {
        return appointmentService.getAppointmentsByDoctor(doctorName);
    }

    @GetMapping("/patient/{patientName}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public List<Appointment> getAppointmentsByPatient(@PathVariable String patientName) {
        return appointmentService.getAppointmentsByPatient(patientName);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }
}
