package com.example.demo.service;

import com.example.demo.repository.PrescriptionRepository;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.MedicalRecordRepository;
import com.example.demo.model.Prescription;
import com.example.demo.model.Booking;
import com.example.demo.entity.MedicalRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Transactional
    public Prescription createPrescription(Prescription prescription) {
        // 1. Save the prescription
        Prescription saved = prescriptionRepository.save(prescription);

        // 2. Mark the booking as completed
        bookingRepository.findById(prescription.getBookingId()).ifPresent(booking -> {
            booking.setConsultationStatus("completed");
            booking.setStatus("completed");
            booking.setUpdatedAt(java.time.LocalDateTime.now());
            bookingRepository.save(booking);
        });

        // 3. Automatically create a Medical History entry
        MedicalRecord record = new MedicalRecord();
        record.setPatientId(prescription.getPatientId());
        record.setBookingId(prescription.getBookingId());
        record.setDoctorId(prescription.getDoctorId());
        record.setDoctorName(prescription.getDoctorName());
        record.setDoctorDepartment(prescription.getDoctorDepartment());
        record.setRecordType("Consultation");
        
        // Compile details from prescription notes and medicines
        StringBuilder details = new StringBuilder();
        details.append("CLINICAL NOTES: ").append(prescription.getNotes()).append("\n\n");
        details.append("SUGGESTIONS: ").append(prescription.getSuggestions()).append("\n\n");
        
        try {
            // Include formatted medicines summary
            String medsJson = prescription.getMedicines();
            details.append("PRESCRIBED MEDICINES:\n");
            // Simple string append for summary in records
            details.append(medsJson); 
        } catch (Exception e) {
            details.append("Medicines summary unavailable.");
        }
        
        record.setDetails(details.toString());
        record.setRecordDate(java.time.LocalDateTime.now());
        medicalRecordRepository.save(record);

        return saved;
    }

    public List<Prescription> getPrescriptionsByPatient(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getPrescriptionsByDoctor(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }
}
