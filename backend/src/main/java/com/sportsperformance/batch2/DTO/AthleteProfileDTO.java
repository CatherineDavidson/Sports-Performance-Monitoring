package com.sportsperformance.batch2.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sportsperformance.batch2.models.Coach;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
@Data
public class AthleteProfileDTO {
    private Long athleteId;
    private String firstName;
    private String lastName;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date birthDate;
    private String gender;
    private float height;
    private float weight;
    private String category;
    private String email;
    private String username;

    @JsonIgnoreProperties("athletes")
    private Coach coachId;

    private MultipartFile photoUrl; // For incoming file uploads
    private String photoBase64;     // For outgoing Base64-encoded image
}

