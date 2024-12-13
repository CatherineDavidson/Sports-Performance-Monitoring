package com.sportsperformance.batch2.DTO;


import lombok.Data;

import java.util.Date;

@Data
public class AchievementDTO {
    private Long achievementId;
    private String title;
    private String description;
    private Date achievedDate;
}

