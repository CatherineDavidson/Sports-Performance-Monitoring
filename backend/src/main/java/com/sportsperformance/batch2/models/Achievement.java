package com.sportsperformance.batch2.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long achievementId;

    @ManyToOne
    @JoinColumn(name = "coachId", nullable = false)
    private Coach coach;

    private String title;
    private String description;
    private Date achievedDate;

}
