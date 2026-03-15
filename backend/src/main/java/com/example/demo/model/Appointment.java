package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;
    private String doctorName;

    @Column(name = "appointment_date")
    private String date;

    @Column(name = "appointment_time")
    private String time;

    private String reason;
    private String status = "Pending"; // default status
}
