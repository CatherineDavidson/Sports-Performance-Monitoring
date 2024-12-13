package com.sportsperformance.batch2.DTO;


import lombok.Data;

import java.util.Date;

@Data
public class DailyDietDTO {
    private Long dietId;
    private Long athleteId;
    private Date date;
    private float calories;
    private float protein;
    private float carbohydrate, fat, fibre, water;

    private Long weightPlanId;
}
