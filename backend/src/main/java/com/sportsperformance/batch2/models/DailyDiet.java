package com.sportsperformance.batch2.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class DailyDiet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dietId;

    @ManyToOne
    @JoinColumn(name = "athleteId", nullable = false)
    private Athlete athlete;

    private Date date;
    private float calories;
//    private float currentWeight;

    @ManyToOne
    @JoinColumn(name = "weightPlanId")
    private WeightPlan weightPlan;

    private float protein;
    private float carbohydrate, fat, fibre, water;
}
