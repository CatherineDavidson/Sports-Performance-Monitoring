package com.sportsperformance.batch2.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class EventResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int resultId;

    @ManyToOne
    @JoinColumn(name = "eventId", nullable = false)
    @JsonIgnoreProperties("eventResults")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "athleteId", nullable = false)
    @JsonIgnoreProperties("eventResults")
    private Athlete athlete;

    private float score;
    private String comment;

}
