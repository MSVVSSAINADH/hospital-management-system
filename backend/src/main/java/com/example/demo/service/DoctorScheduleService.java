package com.example.demo.service;

import com.example.demo.model.DoctorSchedule;
import com.example.demo.repository.DoctorScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class DoctorScheduleService {

    @Autowired
    private DoctorScheduleRepository scheduleRepository;

    public List<String> getAvailableDoctors(String date) {
        List<DoctorSchedule> schedules = scheduleRepository.findByDate(date);

        return schedules.stream()
                // safe: blockedSlots is never null (see model). Also allow empty lists.
                .filter(schedule -> schedule.getBlockedSlots() == null
                        || schedule.getBlockedSlots().isEmpty()
                        || schedule.getBlockedSlots().size() < 8)
                .map(DoctorSchedule::getDoctorName)
                .distinct()
                .collect(Collectors.toList());
    }

    public DoctorSchedule saveSchedule(DoctorSchedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public Optional<DoctorSchedule> getSchedule(String doctorName, String date) {
        return scheduleRepository.findByDoctorNameAndDate(doctorName, date);
    }
}
