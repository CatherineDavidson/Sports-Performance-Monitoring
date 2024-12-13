package com.sportsperformance.batch2.DTO;

import com.sportsperformance.batch2.models.Meet;
import lombok.Data;

import java.util.Date;

@Data
public class EventResponseDTO {

    private String eventTitle;
    private int eventId;
    private String category;
    private String location;
    private Date eventDate;
    private String eventDescription;
    private Meet meetId;
    private String imageBase64;
    private String meetName;

    private float score;
    private String comment;



}

