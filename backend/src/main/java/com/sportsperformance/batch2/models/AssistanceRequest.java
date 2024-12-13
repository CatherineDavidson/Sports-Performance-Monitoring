package com.sportsperformance.batch2.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class AssistanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assistanceRequestId;



    @OneToOne
    @JoinColumn(name = "athleteId", nullable = false)
    private Athlete athlete;

    @ManyToOne
    @JoinColumn(name = "coachId", nullable = false)
    private Coach coach;

    private String status;
    private Date requestDate;
    private String remarks;

}

