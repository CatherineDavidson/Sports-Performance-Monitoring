package com.sportsperformance.batch2.DTO;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
@Data
public class CoachDTO {
    private Long coachId;
    private String firstName;
    private String lastName;
    private String email, expertise;
    private MultipartFile imageFile;
    private String imageBase64;
    private String username;
}