package com.sportsperformance.batch2.DTO;


import lombok.Data;

import java.util.List;

@Data
public class WeightPlanDTO {
    private Long planId;
    private Long athleteId;
    private float startWeight;
    private float targetWeight;
    private String preference;
    private int dailyCalorieGoal;
    private List<DailyDietDTO> dailyDiets;
}
