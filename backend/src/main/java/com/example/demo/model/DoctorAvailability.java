package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctor_availability")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long doctorId;

    @Column(nullable = false)
    private String doctorName;

    @Column(nullable = false)
    private String date;

    @Column(nullable = false)
    private String timeSlot;

    // In the "Default Available" model, records in this table 
    // represent a block or override (e.g., UNAVAILABLE).
    @Column(nullable = false)
    private String status = "UNAVAILABLE"; 

    @Column(nullable = false)
    private boolean isBooked = false; // Still used if we want to block specifically a booked slot or handle it elsewhere
}
