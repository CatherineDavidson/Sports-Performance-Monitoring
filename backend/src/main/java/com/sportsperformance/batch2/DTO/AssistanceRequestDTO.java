package com.sportsperformance.batch2.DTO;


import lombok.Data;

import java.util.Date;

@Data
public class AssistanceRequestDTO {
    private Long assistanceRequestId;
    private Long coachId;      // For linking a request to a coach
    private Long athleteId;
    private AthleteProfileDTO athlete;// For providing the athlete ID
    private String remarks;   // Remarks from the athlete
    private String status;    // Status of the request (Pending/Accepted/Rejected)
    private Date requestDate; // Date of request
}
