package com.example.demo.service;

import com.example.demo.model.Appointment;
import com.example.demo.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByDoctor(String doctorName) {
        return appointmentRepository.findByDoctorName(doctorName);
    }

    public List<Appointment> getAppointmentsByPatient(String patientName) {
        return appointmentRepository.findByPatientName(patientName);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
}
