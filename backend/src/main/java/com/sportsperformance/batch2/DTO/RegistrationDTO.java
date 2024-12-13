package com.sportsperformance.batch2.DTO;

import lombok.Data;

import java.util.Date;

@Data
public class RegistrationDTO {
    private int registrationId;
    private int eventId;
    private Long athleteId;
    private String eventName;
    private Date registrationDate;
    private String status;
    private String remarks;
    private String meetName;
    private AthleteProfileDTO athlete;

    public RegistrationDTO(int registrationId, int eventId, Long athleteId, String eventName, Date registrationDate, String status, String remarks, String meetName, AthleteProfileDTO athlete) {
        this.registrationId = registrationId;
        this.eventId = eventId;
        this.athleteId = athleteId;
        this.eventName = eventName;
        this.registrationDate = registrationDate;
        this.status = status;
        this.remarks = remarks;
        this.meetName = meetName;
        this.athlete = athlete;
    }
}