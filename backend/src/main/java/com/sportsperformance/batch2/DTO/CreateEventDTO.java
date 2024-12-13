package com.sportsperformance.batch2.DTO;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
public class CreateEventDTO {

    private String eventTitle;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date eventDate;
    private Long meetId;
    private String location;
    private String category;
    private String eventDescription;
    private MultipartFile image;

    // Additional constructors, if needed, can be added here
}
