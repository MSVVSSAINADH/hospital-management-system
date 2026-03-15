package com.example.demo.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "doctor_schedule")
public class DoctorSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String doctorName;

    @Column(name = "schedule_date")
    private String date;

    @ElementCollection
    @CollectionTable(name = "blocked_slots", joinColumns = @JoinColumn(name = "schedule_id"))
    @Column(name = "time_slot")
    private List<String> blockedSlots = new ArrayList<>();

    // 🔹 Default constructor
    public DoctorSchedule() {}

    // 🔹 All-args constructor
    public DoctorSchedule(Long id, String doctorName, String date, List<String> blockedSlots) {
        this.id = id;
        this.doctorName = doctorName;
        this.date = date;
        this.blockedSlots = blockedSlots;
    }

    // 🔹 Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<String> getBlockedSlots() {
        return blockedSlots;
    }

    public void setBlockedSlots(List<String> blockedSlots) {
        this.blockedSlots = blockedSlots;
    }
}
