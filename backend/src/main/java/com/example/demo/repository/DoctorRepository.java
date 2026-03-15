package com.example.demo.repository;

import com.example.demo.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByDeletedFalse();
    List<Doctor> findByDeletedTrue();
    Optional<Doctor> findByUsername(String username);
    Optional<Doctor> findByEmail(String email);
}
