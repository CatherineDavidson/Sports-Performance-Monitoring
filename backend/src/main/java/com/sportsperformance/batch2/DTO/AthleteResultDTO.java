package com.sportsperformance.batch2.DTO;

import lombok.Data;

@Data
public class AthleteResultDTO {
    private Long athleteId;
    private String athleteName;
    private String athletePicture;
    private float score;
    private String comment;
}
