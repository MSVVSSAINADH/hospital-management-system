package com.example.demo.repository;

import com.example.demo.model.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    List<DoctorAvailability> findByDoctorId(Long doctorId);
    List<DoctorAvailability> findByIsBookedFalse();
    List<DoctorAvailability> findByDoctorIdAndDateAndIsBookedFalse(Long doctorId, String date);
}
