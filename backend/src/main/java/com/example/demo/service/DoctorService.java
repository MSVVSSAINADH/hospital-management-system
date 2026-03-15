package com.example.demo.service;

import com.example.demo.entity.Doctor;
import com.example.demo.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findByDeletedFalse().stream()
                .filter(d -> d.getStatus() == Doctor.Status.ACTIVE)
                .toList();
    }

    public List<Doctor> getDeletedDoctors() {
        return doctorRepository.findByDeletedTrue();
    }

    public Doctor addDoctor(Doctor doctor) {
        // Hash password before saving
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
        doctor.setStatus(Doctor.Status.ACTIVE);
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctorStatus(Long id, String statusStr) {
        Optional<Doctor> optionalDoctor = doctorRepository.findById(id);
        if (optionalDoctor.isPresent()) {
            Doctor doctor = optionalDoctor.get();
            try {
                doctor.setStatus(Doctor.Status.valueOf(statusStr.toUpperCase()));
                return doctorRepository.save(doctor);
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
        return null;
    }

    public Doctor authenticate(String identifier, String password) throws Exception {
        Optional<Doctor> doctorOpt = doctorRepository.findByUsername(identifier);
        if (doctorOpt.isEmpty()) {
            doctorOpt = doctorRepository.findByEmail(identifier);
        }

        if (doctorOpt.isEmpty()) {
            throw new Exception("Doctor not found");
        }

        Doctor doctor = doctorOpt.get();

        if (doctor.isDeleted()) {
            throw new Exception("Account has been removed");
        }

        if (doctor.getStatus() == Doctor.Status.INACTIVE) {
            throw new Exception("Your account is currently inactive. Please contact the administrator.");
        }

        if (!passwordEncoder.matches(password, doctor.getPassword())) {
            throw new Exception("Invalid credentials");
        }

        return doctor;
    }

    public void softDeleteDoctor(Long id) {
        Optional<Doctor> optionalDoctor = doctorRepository.findById(id);
        if (optionalDoctor.isPresent()) {
            Doctor doctor = optionalDoctor.get();
            doctor.setDeleted(true);
            doctorRepository.save(doctor);
        }
    }

    public void restoreDoctor(Long id) {
        Optional<Doctor> optionalDoctor = doctorRepository.findById(id);
        if (optionalDoctor.isPresent()) {
            Doctor doctor = optionalDoctor.get();
            doctor.setDeleted(false);
            doctorRepository.save(doctor);
        }
    }
}
