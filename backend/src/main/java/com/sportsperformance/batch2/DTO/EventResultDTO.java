package com.sportsperformance.batch2.DTO;

import lombok.Data;

import java.util.Date;

@Data
public class EventResultDTO {
    private Long athleteId;
    private String athleteName;
    private String photoBase64;
    private float score;
    private String comment;
    private String eventName;
    private String meetName;
    private Date eventDate;
}
