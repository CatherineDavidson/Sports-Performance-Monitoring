package com.sportsperformance.batch2.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class WeightPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long planId;

    @OneToOne
    @JoinColumn(name = "athleteId", nullable = false)
    private Athlete athlete;

    private float startWeight;
    private float targetWeight;
    private String preference;
    private int dailyCalorieGoal;

    @OneToMany(mappedBy = "weightPlan")
    private List<DailyDiet> dailyDiets;

}

