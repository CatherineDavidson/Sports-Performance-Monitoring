package com.sportsperformance.batch2.Controllers;
import com.sportsperformance.batch2.DTO.*;
import com.sportsperformance.batch2.Repositories.AthleteRepository;
import com.sportsperformance.batch2.Repositories.EventRepository;
import com.sportsperformance.batch2.Services.AdminService;
import com.sportsperformance.batch2.Services.AthleteService;
import com.sportsperformance.batch2.Services.CoachService;
import com.sportsperformance.batch2.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> getMessage() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from the backend!");
        return ResponseEntity.ok(response);
    }
    @PostMapping(value = "/createevent", consumes = "multipart/form-data")
    public ResponseEntity<Event> createEvent(@ModelAttribute CreateEventDTO eventDTO) {
        try {
            Event createdEvent = adminService.createEvent(eventDTO);
            return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    private EventResponseDTO mapToDTO(Event event) {
        EventResponseDTO dto = new EventResponseDTO();
        dto.setEventTitle(event.getEventTitle());
        dto.setCategory(event.getCategory());
        dto.setLocation(event.getLocation());
        dto.setEventDate(event.getEventDate());
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
    @GetMapping("/registrations/pending")
    public ResponseEntity<List<RegistrationDTO>> getPendingRegistrations() {
        try {
            List<RegistrationDTO> registrationDTOs = adminService.getPendingRegistrations();
            return ResponseEntity.ok(registrationDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }
    @PostMapping("/createmeet")
    public ResponseEntity<Meet> createMeet(@RequestBody MeetDTO meetRequest) {
        try {
            String meetName = meetRequest.getMeetName();
            Meet createdMeet = adminService.createMeet(meetName);
            return new ResponseEntity<>(createdMeet, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/allMeet")
    public ResponseEntity<List<Meet>> getAllMeet() {
        return ResponseEntity.ok(adminService.getAllMeets());
    }
    @PutMapping("/registration/{registrationId}")
    public ResponseEntity<String> updateRegistrationStatus(
            @PathVariable Long registrationId,
            @RequestParam String status) {
        try {
            adminService.updateRegistrationStatus(registrationId, status);
            return ResponseEntity.ok("Registration updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/registrations")
    public ResponseEntity<List<RegistrationDTO>> getAllRegistrations() {
        try {
            List<RegistrationDTO> registrations = adminService.getAllRegistrations();
            return ResponseEntity.ok(registrations);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }
    @GetMapping("/athlete/{athleteId}")
    public ResponseEntity<AthleteProfileDTO> getAthlete(@PathVariable Long athleteId) {
        try {
            AthleteProfileDTO athlete = adminService.getAthleteById(athleteId);
            return ResponseEntity.ok(athlete);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }
    @GetMapping("/events/pending-results")
    public ResponseEntity<List<EventWithPendingResultDTO>> getEventsWithPendingResults() {
        List<EventWithPendingResultDTO> pendingResults = adminService.getEventsWithPendingResults();
        return ResponseEntity.ok(pendingResults);
    }
    @GetMapping("/events/{eventId}/athletes")
    public ResponseEntity<List<AthleteResultDTO>> getAthletesForEvent(@PathVariable Long eventId) {
        try {
            List<AthleteResultDTO> athletes = adminService.getAthletesForEvent(eventId);
            return ResponseEntity.ok(athletes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @PostMapping("/events/{eventId}/publish-results")
    public ResponseEntity<String> publishResults(
            @PathVariable Long eventId,
            @RequestBody List<AthleteResultDTO> results) {
        try {
            adminService.saveEventResult(eventId, results);
            return ResponseEntity.ok("Results published successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @DeleteMapping("/registration/{registrationId}")
    public ResponseEntity<String> deleteRegistration(@PathVariable Long registrationId) {
        try {
            adminService.deleteRegistrationById(registrationId);
            return ResponseEntity.ok("Registration deleted successfully.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Registration not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/events")
    public ResponseEntity<List<EventResponseDTO>> getAllEvents() {
        try {
            List<EventResponseDTO> events = adminService.getAllEvents();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }
    @Autowired
    private CoachService coachService;
    @GetMapping("/getallcoaches")
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
    @PutMapping("/updateevent/{eventId}")
    public ResponseEntity<Event> editEvent(
            @PathVariable Long eventId,
            @ModelAttribute CreateEventDTO eventDTO) {
        Event updatedEvent = adminService.updateEvent(eventId, eventDTO);
        return ResponseEntity.ok(updatedEvent);
    }
    @DeleteMapping("/deleteevent/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        adminService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("result/by-athlete/{athleteId}")
    public ResponseEntity<List<EventResultDTO>> getResultsByAthleteId(@PathVariable Long athleteId) {
        List<EventResultDTO> results = adminService.getResultsByAthleteId(athleteId);
        return ResponseEntity.ok(results);
    }
    @GetMapping("result/by-event/{eventId}")
    public ResponseEntity<List<EventResultDTO>> getResultsByEventId(@PathVariable Integer eventId) {
        List<EventResultDTO> results = adminService.getResultsByEventId(eventId);
        return ResponseEntity.ok(results);
    }
    @GetMapping("results/{athleteId}/event/{eventId}")
    public ResponseEntity<EventResultDTO> getResultByAthleteIdAndEventId(
            @PathVariable Long athleteId,
            @PathVariable Integer eventId) {
        EventResultDTO result = adminService.getResultByAthleteIdAndEventId(athleteId, eventId);
        return ResponseEntity.ok(result);
    }
    @GetMapping("event/leaderboard/{eventId}")
    public ResponseEntity<List<EventResultDTO>> getLeaderboardByEventId(@PathVariable Integer eventId) {
        List<EventResultDTO> leaderboard = adminService.getLeaderboardByEventId(eventId);
        return ResponseEntity.ok(leaderboard);
    }
    @Autowired
    AthleteRepository athleteRepository;
    @Autowired
    AthleteService athleteService;
    @GetMapping("/top-performance/by-athlete/{athleteId}")
    public ResponseEntity<List<EventResultDTO>> getTopPerformanceByAthleteId(@PathVariable Long athleteId) {
        Athlete ath = athleteRepository.findById(athleteId).get();
        String username = ath.getUsername();
        List<EventResultDTO> topPerformance = athleteService.getTop5PerformancesByLoggedInAthlete(username);
        return ResponseEntity.ok(topPerformance);
    }
}