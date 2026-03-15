package com.example.demo.config;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.entity.Doctor;
import com.example.demo.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String oldAdminEmail = "admin@gmail.com";
        String newAdminEmail = "admin@klhospitals.in";
        
        // Check if old admin exists and migrate if so
        Optional<User> oldAdmin = userRepository.findByEmail(oldAdminEmail);
        if (oldAdmin.isPresent()) {
            User admin = oldAdmin.get();
            admin.setEmail(newAdminEmail);
            admin.setPassword(passwordEncoder.encode("admin")); // New password
            userRepository.save(admin);
            System.out.println("✅ Migrated admin@gmail.com to admin@klhospitals.in");
        } else {
            // Seed new Admin user if it doesn't exist
            Optional<User> existingAdmin = userRepository.findByEmail(newAdminEmail);
            if (existingAdmin.isEmpty()) {
                User adminUser = new User();
                adminUser.setUsername("Super Admin");
                adminUser.setEmail(newAdminEmail);
                adminUser.setPassword(passwordEncoder.encode("admin"));
                adminUser.setRole("admin");
                adminUser.setStatus("Offline");
                adminUser.setZone("HQ");
                adminUser.setMobile("0000000000");
                adminUser.setAddress("Hospital HQ");
                
                userRepository.save(adminUser);
                System.out.println("✅ Default Admin User seeded: admin@klhospitals.in / admin");
            }
        }

        // Ensure standard verification doctor exists
        String verificationDoctorEmail = "sarah@klhospitals.in";
        if (doctorRepository.findByEmail(verificationDoctorEmail).isEmpty()) {
            seedDoctor("Dr. Sarah Johnson", verificationDoctorEmail, "Cardiology", "doctor123", "MBBS, MD - Cardiology");
            System.out.println("✅ Verification Doctor seeded: sarah@klhospitals.in / doctor123");
        }

        // Seed other Sample Doctors if none exist
        if (doctorRepository.count() < 2) {
            seedDoctor("Dr. Michael Chen", "michael@klhospitals.in", "Neurology", "doctor123", "MBBS, MD - Neurology");
            seedDoctor("Dr. Emily White", "emily@klhospitals.in", "Pediatrics", "doctor123", "MBBS, MD - Pediatrics");
            seedDoctor("Dr. David Wilson", "david@klhospitals.in", "Orthopedics", "doctor123", "MBBS, MS - Orthopedics");
            System.out.println("✅ Additional Sample Doctors seeded.");
        }
    }

    private void seedDoctor(String name, String email, String spec, String pass, String desc) {
        Doctor doc = new Doctor();
        doc.setName(name);
        doc.setEmail(email);
        doc.setUsername(email.split("@")[0]);
        doc.setSpecialization(spec);
        doc.setPassword(passwordEncoder.encode(pass));
        doc.setStatus(Doctor.Status.ACTIVE);
        doc.setDepartment(spec); // Setting department same as spec initially for seeded data
        doc.setDeleted(false);
        doctorRepository.save(doc);
    }
}
