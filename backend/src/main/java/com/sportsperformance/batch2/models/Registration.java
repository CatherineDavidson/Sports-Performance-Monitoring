package com.sportsperformance.batch2.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int registrationId;

    @ManyToOne
    @JoinColumn(name = "eventId", nullable = false)
    @JsonIgnoreProperties("registrations")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "athleteId", nullable = false)
    @JsonIgnoreProperties("registrations")
    private Athlete athlete;

    private Date registrationDate;
    private String status; //Pending, Approved, Rejected
    private String remarks;

}
