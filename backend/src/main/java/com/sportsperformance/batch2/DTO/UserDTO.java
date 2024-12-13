package com.sportsperformance.batch2.DTO;

import lombok.Data;

@Data
public class UserDTO {
    private String username;
    private String email;
    private String password;
    private String confirmPassword;
    private String role;
}
