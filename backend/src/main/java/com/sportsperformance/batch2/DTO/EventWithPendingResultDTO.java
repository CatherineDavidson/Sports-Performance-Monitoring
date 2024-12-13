package com.sportsperformance.batch2.DTO;

import lombok.Data;

@Data
public class EventWithPendingResultDTO {
    private int eventId;
    private String eventTitle;
    private String category;
    private String location;
    private String eventDate;
}
