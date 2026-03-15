package com.example.demo.repository;

import com.example.demo.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {
    Optional<DoctorSchedule> findByDoctorNameAndDate(String doctorName, String date);
    List<DoctorSchedule> findByDate(String date);
}
