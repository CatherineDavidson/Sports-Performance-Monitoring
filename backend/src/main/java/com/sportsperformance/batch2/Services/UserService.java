package com.sportsperformance.batch2.Services;
import com.sportsperformance.batch2.DTO.UserDTO;
import com.sportsperformance.batch2.Repositories.AdminRepository;
import com.sportsperformance.batch2.Repositories.AthleteRepository;
import com.sportsperformance.batch2.Repositories.CoachRepository;
import com.sportsperformance.batch2.models.Admin;
import com.sportsperformance.batch2.models.Athlete;
import com.sportsperformance.batch2.models.BaseUser;
import com.sportsperformance.batch2.models.Coach;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
@Service
public class UserService {
    @Autowired
    private AthleteRepository athleteRepository;
    @Autowired
    private CoachRepository coachRepository;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @PostConstruct
    public void initAdmin() {
        if (adminRepository.findByUsername("admin").isEmpty()) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setEmail("admin@admin.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setCreatedAt(LocalDateTime.now());
            adminRepository.save(admin);
        }
    }
    public void registerUser(UserDTO userDTO) {
        // Validate the password
        validatePassword(userDTO.getPassword());
        // Validate email
        validateEmail(userDTO.getEmail());

        // Validate username
        validateUsername(userDTO.getUsername());

        // Check if confirmPassword matches password
        if (!userDTO.getPassword().equals(userDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and Confirm Password do not match.");
        }

        switch (userDTO.getRole().toLowerCase()) {
            case "athlete":
                if (athleteRepository.findByEmail(userDTO.getEmail()).isPresent()) {
                    throw new IllegalArgumentException("Email already exists");
                }
                if (athleteRepository.findByUsername(userDTO.getUsername()).isPresent()) {
                    throw new IllegalArgumentException("Username already exists");
                }
                Athlete athlete = new Athlete();
                athlete.setUsername(userDTO.getUsername());
                athlete.setEmail(userDTO.getEmail());
                athlete.setPassword(passwordEncoder.encode(userDTO.getPassword()));
                athlete.setCreatedAt(LocalDateTime.now());
                athleteRepository.save(athlete);
                break;
            case "coach":
                if (coachRepository.findByEmail(userDTO.getEmail()).isPresent()) {
                    throw new IllegalArgumentException("Email already exists");
                }
                if (coachRepository.findByUsername(userDTO.getUsername()).isPresent()) {
                    throw new IllegalArgumentException("Username already exists");
                }
                Coach coach = new Coach();
                coach.setUsername(userDTO.getUsername());
                coach.setEmail(userDTO.getEmail());
                coach.setPassword(passwordEncoder.encode(userDTO.getPassword()));
                coach.setCreatedAt(LocalDateTime.now());
                coachRepository.save(coach);
                break;
            case "admin":
                throw new IllegalArgumentException("Admin registration is not allowed via this method.");
            default:
                throw new IllegalArgumentException("Invalid role: " + userDTO.getRole());
        }
    }
    // Helper method to validate email
    private void validateEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
        if (!email.matches(emailRegex)) {
            throw new IllegalArgumentException("Invalid email format.");
        }
    }

    // Helper method to validate username
    private void validateUsername(String username) {
        if (username.length() < 3 || username.length() > 20) {
            throw new IllegalArgumentException("Username must be between 3 and 20 characters.");
        }
        if (!username.matches("^[A-Za-z0-9._-]+$")) {
            throw new IllegalArgumentException("Username can only contain letters, numbers, dots, underscores, and hyphens.");
        }
    }
    // Helper method to validate password
    private void validatePassword(String password) {
        if (password.length() < 8 || password.length() > 20) {
            throw new IllegalArgumentException("Password must be between 8 and 20 characters.");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("Password must contain at least one uppercase letter.");
        }
        if (!password.matches(".*\\d.*")) {
            throw new IllegalArgumentException("Password must contain at least one number.");
        }
        if (!password.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            throw new IllegalArgumentException("Password must contain at least one special character.");
        }
    }

    public BaseUser findByEmailOrUsername(String identifier) {
//        System.out.println("check3");
        Optional<BaseUser> athleteByUsername = athleteRepository.findByUsername(identifier).map(user -> (BaseUser) user);
        if (athleteByUsername.isPresent()) return athleteByUsername.get();
        Optional<BaseUser> athleteByEmail = athleteRepository.findByEmail(identifier).map(user -> (BaseUser) user);
        if (athleteByEmail.isPresent()) return athleteByEmail.get();
        Optional<BaseUser> coachByUsername = coachRepository.findByUsername(identifier).map(user -> (BaseUser) user);
        if (coachByUsername.isPresent()) return coachByUsername.get();
        Optional<BaseUser> coachByEmail = coachRepository.findByEmail(identifier).map(user -> (BaseUser) user);
        if (coachByEmail.isPresent()) return coachByEmail.get();
        Optional<BaseUser> adminByUsername = adminRepository.findByUsername(identifier).map(user -> (BaseUser) user);
        if (adminByUsername.isPresent()) return adminByUsername.get();
        return adminRepository.findByEmail(identifier).map(user -> (BaseUser) user).orElse(null);
    }
    public boolean checkPassword(String rawPassword, String storedPassword) {
        return passwordEncoder.matches(rawPassword, storedPassword);
    }
}