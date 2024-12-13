package com.sportsperformance.batch2.Controllers;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sportsperformance.batch2.DTO.*;
import com.sportsperformance.batch2.Repositories.EventRepository;
import com.sportsperformance.batch2.Services.AthleteService;
import com.sportsperformance.batch2.Services.CoachService;
import com.sportsperformance.batch2.models.Athlete;
import com.sportsperformance.batch2.models.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@JsonIgnoreProperties({"parentField"})
@RestController
@RequestMapping("/athlete")
public class AthleteController {
    @Autowired
    private AthleteService athleteService;
    @PostMapping(value = "/createProfile", consumes = "multipart/form-data")
    public ResponseEntity<String> createProfile(
            @ModelAttribute AthleteProfileDTO profileDTO) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        try {
            athleteService.createOrUpdateProfile(username, profileDTO);
            return ResponseEntity.ok("Profile created/updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating/updating profile: " + e.getMessage());
        }
    }
    private AthleteProfileDTO mapToDTO(Athlete athlete) {
        AthleteProfileDTO dto = new AthleteProfileDTO();
        dto.setFirstName(athlete.getFirstName());
        dto.setLastName(athlete.getLastName());
        dto.setBirthDate(athlete.getBirthDate());
        dto.setGender(athlete.getGender());
        dto.setHeight(athlete.getHeight());
        dto.setWeight(athlete.getWeight());
        dto.setCategory(athlete.getCategory());
        dto.setCoachId(athlete.getCoach());
        if (athlete.getPhoto() != null) {
            byte[] photoBytes = athlete.getPhoto();
            dto.setPhotoBase64(Base64.getEncoder().encodeToString(photoBytes));
        } else {
            dto.setPhotoBase64(null);
        }
        return dto;
    }
    @GetMapping("/profile")
    public ResponseEntity<AthleteProfileDTO> getAthleteProfile() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        try {
            Athlete athlete = athleteService.getAthleteProfile(username);
            AthleteProfileDTO athleteProfileDTO = mapToDTO(athlete);
            return ResponseEntity.ok(athleteProfileDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @PostMapping("/registerForEvent/{eventId}")
    public ResponseEntity<String> registerForEvent(@PathVariable Long eventId, @RequestBody RegistrationRequestDTO requestDTO) throws Exception {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        athleteService.registerForEvent(username, requestDTO, eventId);
        return ResponseEntity.ok("Registration successful");
    }
    @GetMapping("/events")
    public ResponseEntity<List<EventResponseDTO>> getAvailableEvents() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        try {
            List<EventResponseDTO> events = athleteService.getAvailableEvents(username);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    @GetMapping("/events/registered")
    public ResponseEntity<List<RegistrationDTO>> getRegisteredEvents() {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username = userDetails.getUsername();
            List<RegistrationDTO> registrations = athleteService.getRegisteredEvents(username);
            return ResponseEntity.ok(registrations);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }
    @DeleteMapping("/registration/{registrationId}")
    public ResponseEntity<String> deleteRegistration(@PathVariable Long registrationId) {
        try {
            athleteService.deleteRegistrationById(registrationId);
            return ResponseEntity.ok("Registration deleted successfully.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Registration not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
    @Autowired
    private CoachService coachService;
    @GetMapping("getallcoaches")
    public ResponseEntity<List<CoachSummaryDTO>> getAllCoaches() {
        return ResponseEntity.ok(coachService.getAllCoaches());
    }
    @GetMapping("coach/{id}")
    public ResponseEntity<CoachDTO> getCoachById(@PathVariable Long id) {
        return ResponseEntity.ok(coachService.getCoachById(id));
    }
    @GetMapping("achievements/coach/{coachId}")
    public ResponseEntity<List<AchievementDTO>> getAllAchievementsByCoachId(@PathVariable Long coachId) {
        return ResponseEntity.ok(coachService.getAllAchievementsByCoachId(coachId));
    }
    @PostMapping("/createassistancereq")
    public ResponseEntity<AssistanceRequestDTO> createRequest(@ModelAttribute AssistanceRequestDTO dto) {
        return ResponseEntity.ok(athleteService.createRequest(dto));
    }
    @GetMapping("/getassistancereq")
    public ResponseEntity<AssistanceRequestDTO> getRequestsByLoggedInAthlete() {
        return ResponseEntity.ok(athleteService.getRequestsByLoggedInAthlete());
    }
    ;
    @GetMapping("/getdailydiets")
    public List<DailyDietDTO> getDailyDietsForLoggedInAthlete() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        return athleteService.getDailyDietsByLoggedInAthlete(username);
    }
    @GetMapping("/getweightplan")
    public WeightPlanDTO getWeightPlanForLoggedInAthlete() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        return athleteService.getWeightPlanByLoggedInAthlete(username);
    }
    private EventResponseDTO mapToDTO(Event event) {
        EventResponseDTO dto = new EventResponseDTO();
        dto.setEventTitle(event.getEventTitle());
        dto.setCategory(event.getCategory());
        dto.setLocation(event.getLocation());
        dto.setEventDate(event.getEventDate());
        dto.setMeetName(event.getMeetId().getMeetName());
        dto.setEventDescription(event.getEventDescription());
        if (event.getImage() != null) {
            dto.setImageBase64(Base64.getEncoder().encodeToString(event.getImage()));
        }
        return dto;
    }
    @Autowired
    EventRepository eventRepository;
    @GetMapping("/events/{id}")
    public ResponseEntity<EventResponseDTO> getEvent(@PathVariable Long id) {
        Optional<Event> eventOptional = eventRepository.findById(id);
        if (eventOptional.isPresent()) {
            EventResponseDTO dto = mapToDTO(eventOptional.get());
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @GetMapping("/top-performance")
    public ResponseEntity<List<EventResultDTO>> getTopPerformanceByLoggedInAthlete() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        List<EventResultDTO> results = athleteService.getTop5PerformancesByLoggedInAthlete(username);
        return ResponseEntity.ok(results);
    }
    @GetMapping("result/by-athlete/{athleteId}")
    public ResponseEntity<List<EventResultDTO>> getResultsByAthleteId(@PathVariable Long athleteId) {
        List<EventResultDTO> results = athleteService.getResultsByAthleteId(athleteId);
        return ResponseEntity.ok(results);
    }
    @GetMapping("result/by-event/{eventId}")
    public ResponseEntity<List<EventResultDTO>> getResultsByEventId(@PathVariable Integer eventId) {
        List<EventResultDTO> results = athleteService.getResultsByEventId(eventId);
        return ResponseEntity.ok(results);
    }
    @GetMapping("results/event/{eventId}")
    public ResponseEntity<EventResultDTO> getResultByAthleteIdAndEventId(
            @PathVariable Integer eventId) {
        EventResultDTO result = athleteService.getResultByEventId(eventId);
        return ResponseEntity.ok(result);
    }
    @GetMapping("event/leaderboard/{eventId}")
    public ResponseEntity<List<EventResultDTO>> getLeaderboardByEventId(@PathVariable Integer eventId) {
        List<EventResultDTO> leaderboard = athleteService.getLeaderboardByEventId(eventId);
        return ResponseEntity.ok(leaderboard);
    }
    @GetMapping("/top-performance/by-athlete/{athleteId}")
    public ResponseEntity<EventResultDTO> getTopPerformanceByAthleteId(@PathVariable Long athleteId) {
        EventResultDTO topPerformance = athleteService.getTopPerformanceByAthleteId(athleteId);
        return ResponseEntity.ok(topPerformance);
    }
    @GetMapping("/all-results")
    public ResponseEntity<List<EventResultDTO>> getAllResultsByLoggedInAthlete(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        List<EventResultDTO> results = athleteService.getAllResultsByLoggedInAthlete(username, page, size);
        return ResponseEntity.ok(results);
    }
    @GetMapping("events/no-results")
    public ResponseEntity<List<EventResponseDTO>> getEventsWithoutResults() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        List<EventResponseDTO> events = athleteService.getApprovedRegistrationsWithoutResults(username);
        return ResponseEntity.ok(events);
    }
    @GetMapping("events/with-results")
    public ResponseEntity<List<EventResponseDTO>> getEventsWithResults() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        List<EventResponseDTO> events = athleteService.getApprovedRegistrationsWithResults(username);
        return ResponseEntity.ok(events);
    }


    private String getLoggedInUsername() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }
}