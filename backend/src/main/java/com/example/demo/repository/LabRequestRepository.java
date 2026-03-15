package com.example.demo.repository;

import com.example.demo.entity.LabRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabRequestRepository extends JpaRepository<LabRequest, Long> {
    List<LabRequest> findByPatientId(Long patientId);
    List<LabRequest> findByDoctorId(Long doctorId);
}
