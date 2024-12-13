package com.sportsperformance.batch2.Services;
import com.sportsperformance.batch2.DTO.*;
import com.sportsperformance.batch2.Repositories.*;
import com.sportsperformance.batch2.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;
@Service
public class AthleteService {
    @Autowired
    private AthleteRepository athleteRepository;
    public void createOrUpdateProfile(String username, AthleteProfileDTO profileDTO) throws Exception {
        Optional<Athlete> athleteOptional = athleteRepository.findByUsername(username);
        Athlete athlete = athleteOptional.orElseThrow(() -> new Exception("Athlete not found"));
        athlete.setFirstName(profileDTO.getFirstName());
        athlete.setLastName(profileDTO.getLastName());
        athlete.setBirthDate(profileDTO.getBirthDate());
        athlete.setGender(profileDTO.getGender());
        athlete.setHeight(profileDTO.getHeight());
        athlete.setWeight(profileDTO.getWeight());
        athlete.setCategory(profileDTO.getCategory());
        MultipartFile imageFile = profileDTO.getPhotoUrl();
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                athlete.setPhoto(imageFile.getBytes());
            } catch (IOException e) {
                throw new Exception("Failed to process image: " + e.getMessage());
            }
        }
        athleteRepository.save(athlete);
    }
    public Athlete getAthleteProfile(String athleteId) throws Exception {
        Optional<Athlete> athleteOptional = athleteRepository.findByUsername(athleteId);
        if (athleteOptional.isEmpty()) {
            throw new Exception("Athlete with ID " + athleteId + " not found.");
        }
        return athleteOptional.get();
    }
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private RegistrationRepository registrationRepository;
    public void registerForEvent(String username, RegistrationRequestDTO requestDTO, Long eventId) throws Exception {
        Athlete athlete = athleteRepository.findByUsername(username)
                .orElseThrow(() -> new Exception("Athlete not found with username: " + username));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new Exception("Event not found with ID: " + eventId));
        Registration registration = new Registration();
        registration.setAthlete(athlete);
        registration.setEvent(event);
        registration.setRegistrationDate(new Date());
        registration.setStatus("Pending");
        registration.setRemarks(requestDTO.getRemarks());
        registrationRepository.save(registration);
    }
    public List<EventResponseDTO> getAvailableEvents(String username) {
        Athlete athlete = athleteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Athlete not found"));
        List<Event> events = eventRepository.findAll();
        List<Integer> registeredEventIds = registrationRepository.findEventIdsByAthleteId(athlete.getAthleteId());
        return events.stream()
                .filter(event -> !registeredEventIds.contains(event.getEventId()))
                .map(this::mapToDTO)
                .toList();
    }
    public List<RegistrationDTO> getRegisteredEvents(String username) throws Exception {
        Athlete athlete = athleteRepository.findByUsername(username)
                .orElseThrow(() -> new Exception("Athlete not found"));
        List<Registration> registrations = registrationRepository.findByAthlete(athlete);
        return registrations.stream()
                .map(registration -> {
                    AthleteProfileDTO athleteProfile = new AthleteProfileDTO();
                    athleteProfile.setFirstName(registration.getAthlete().getFirstName());
                    athleteProfile.setLastName(registration.getAthlete().getLastName());
                    athleteProfile.setBirthDate(registration.getAthlete().getBirthDate());
                    athleteProfile.setGender(registration.getAthlete().getGender());
                    athleteProfile.setAthleteId(registration.getAthlete().getAthleteId());
                    athleteProfile.setHeight(registration.getAthlete().getHeight());
                    athleteProfile.setWeight(registration.getAthlete().getWeight());
                    athleteProfile.setCategory(registration.getAthlete().getCategory());
                    athleteProfile.setPhotoBase64(Arrays.toString(registration.getAthlete().getPhoto()));
                    athleteProfile.setEmail(registration.getAthlete().getEmail());
                    athleteProfile.setUsername(registration.getAthlete().getUsername());
                    return new RegistrationDTO(
                            registration.getRegistrationId(),
                            registration.getEvent().getEventId(),
                            registration.getAthlete().getAthleteId(),
                            registration.getEvent().getEventTitle(),
                            registration.getRegistrationDate(),
                            registration.getStatus(),
                            registration.getRemarks(),
                            registration.getEvent().getMeetId().getMeetName(),
                            athleteProfile
                    );
                })
                .collect(Collectors.toList());
    }
    private EventResponseDTO mapToDTO(Event event) {
        EventResponseDTO dto = new EventResponseDTO();
        dto.setEventTitle(event.getEventTitle());
        dto.setMeetId(event.getMeetId());
        dto.setCategory(event.getCategory());
        dto.setEventId(event.getEventId());
        dto.setLocation(event.getLocation());
        dto.setEventDate(event.getEventDate());
        dto.setEventDescription(event.getEventDescription());
        if (event.getImage() != null) {
            dto.setImageBase64(Base64.getEncoder().encodeToString(event.getImage()));
        }
        return dto;
    }
    public void deleteRegistrationById(Long registrationId) {
        if (!registrationRepository.existsById(registrationId)) {
            throw new NoSuchElementException("Registration not found.");
        }
        registrationRepository.deleteById(registrationId);
    }
    @Autowired
    private AssistanceRequestRepository assistanceRequestRepository;
    @Autowired
    private CoachRepository coachRepository;
    private String getLoggedInUsername() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }
    public AssistanceRequestDTO createRequest(AssistanceRequestDTO dto) {
        String username = getLoggedInUsername();
        Athlete athlete = athleteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Athlete not found with username: " + username));
        Coach coach = coachRepository.findById((long) dto.getCoachId())
                .orElseThrow(() -> new RuntimeException("Coach not found with ID: " + dto.getCoachId()));
        AssistanceRequest request = assistanceRequestRepository.findByAthlete(athlete);
        if (request == null) {
            request = new AssistanceRequest();
            request.setAthlete(athlete);
            request.setCoach(coach);
            request.setStatus("Pending");
            request.setRequestDate(new Date());
            System.out.println(dto.getRemarks());
            request.setRemarks(dto.getRemarks());
            System.out.println(request.getRemarks());
            assistanceRequestRepository.save(request);
            return mapToDTO(request);
//            throw new RuntimeException("No assistance request found for athlete: " + username);
        } else {
            request.setAthlete(athlete);
            request.setCoach(coach);
            request.setStatus("Pending");
            request.setRequestDate(new Date());
            System.out.println(dto.getRemarks());
            request.setRemarks(dto.getRemarks());
            System.out.println(request.getRemarks());
            assistanceRequestRepository.save(request);
            return mapToDTO(request);

        }


    }
    private AssistanceRequestDTO mapToDTO(AssistanceRequest request) {
        AssistanceRequestDTO dto = new AssistanceRequestDTO();
        dto.setAssistanceRequestId(request.getAssistanceRequestId());
        dto.setCoachId((Long) request.getCoach().getCoachId());
        dto.setAthleteId((Long) request.getAthlete().getAthleteId());
        dto.setStatus(request.getStatus());
        dto.setRemarks(request.getRemarks());
        dto.setRequestDate(request.getRequestDate());
        return dto;
    }
    public AssistanceRequestDTO getRequestsByLoggedInAthlete() {
        String username = getLoggedInUsername();
        System.out.println(username);
        Athlete athlete = athleteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Athlete not found with username: " + username));
        AssistanceRequest assistanceRequest = assistanceRequestRepository.findByAthlete(athlete);
        if (assistanceRequest == null) {
            throw new RuntimeException("No assistance request found for athlete: " + username);
        }
        return mapToDTO(assistanceRequest);
    }
    @Autowired
    private WeightPlanRepository weightPlanRepository;
    @Autowired
    private DailyDietRepository dailyDietRepository;
    public List<DailyDietDTO> getDailyDietsByLoggedInAthlete(String username) {
        Athlete athlete = athleteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Athlete not found"));
        List<DailyDietDTO> dailyDietDTOs = dailyDietRepository.findByAthleteAthleteIdOrderByDateDesc(athlete.getAthleteId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        Collections.reverse(dailyDietDTOs);
        return dailyDietDTOs;
    }
    public WeightPlanDTO getWeightPlanByLoggedInAthlete(String username) {
        Athlete athlete = athleteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Athlete not found"));
        WeightPlan weightPlan = athlete.getWeightPlan();
        if (weightPlan == null) {
            throw new RuntimeException("No WeightPlan found for the athlete");
        }
        return mapToDTO(weightPlan);
    }
    private DailyDietDTO mapToDTO(DailyDiet dailyDiet) {
        DailyDietDTO dto = new DailyDietDTO();
        dto.setDietId(dailyDiet.getDietId());
        dto.setAthleteId(dailyDiet.getAthlete().getAthleteId());
        dto.setDate(dailyDiet.getDate());
        dto.setCalories(dailyDiet.getCalories());
        dto.setFat(dailyDiet.getFat());
        dto.setFibre(dailyDiet.getFibre());
        dto.setCarbohydrate(dailyDiet.getCarbohydrate());
        dto.setProtein(dailyDiet.getProtein());
        dto.setWater(dailyDiet.getWater());
        dto.setWeightPlanId(dailyDiet.getWeightPlan() != null ? dailyDiet.getWeightPlan().getPlanId() : null);
        return dto;
    }
    private WeightPlanDTO mapToDTO(WeightPlan weightPlan) {
        WeightPlanDTO dto = new WeightPlanDTO();
        dto.setPlanId(weightPlan.getPlanId());
        dto.setAthleteId(weightPlan.getAthlete().getAthleteId());
        dto.setStartWeight(weightPlan.getStartWeight());
        dto.setTargetWeight(weightPlan.getTargetWeight());
        dto.setPreference(weightPlan.getPreference());
        dto.setDailyCalorieGoal(weightPlan.getDailyCalorieGoal());
        return dto;
    }
    @Autowired
    EventResultRepository eventResultRepository;
    public List<EventResultDTO> getTopPerformanceByLoggedInAthlete(String username) {
        List<EventResult> results = eventResultRepository.findByAthleteUsernameOrderByEvent_EventDateDesc(username);
        return results.stream()
                .map(this::toEventResultDTO)
                .collect(Collectors.toList());
    }
    public List<EventResultDTO> getResultsByAthleteId(Long athleteId) {
        List<EventResult> results = eventResultRepository.findByAthleteId(athleteId);
        return results.stream()
                .map(this::toEventResultDTO)
                .collect(Collectors.toList());
    }
    public List<EventResultDTO> getResultsByEventId(Integer eventId) {
        List<EventResult> results = eventResultRepository.findByEventId(eventId);
        return results.stream()
                .map(this::toEventResultDTO)
                .collect(Collectors.toList());
    }
    public EventResultDTO getResultByEventId(Integer eventId) {
        String username = getLoggedInUsername();
        Athlete athlete = athleteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Athlete not found"));
        EventResult result = eventResultRepository.findByAthleteIdAndEventId(athlete.getAthleteId(), eventId)
                .orElseThrow(() -> new RuntimeException("Result not found"));
        return toEventResultDTO(result);
    }
    public List<EventResultDTO> getLeaderboardByEventId(Integer eventId) {
        List<EventResultDTO> leaderboard = getResultsByEventId(eventId);
        if (leaderboard == null || leaderboard.isEmpty()) {
            return Collections.emptyList();
        }
        return leaderboard;
    }
    private EventResultDTO toEventResultDTO(EventResult result) {
        EventResultDTO dto = new EventResultDTO();
        dto.setAthleteId(result.getAthlete().getAthleteId());
        dto.setScore(result.getScore());
        dto.setEventDate(result.getEvent().getEventDate());
        dto.setComment(result.getComment());
        dto.setAthleteName(result.getAthlete().getFirstName() + " " + result.getAthlete().getLastName());
        dto.setEventName(result.getEvent().getEventTitle());
        dto.setMeetName(result.getEvent().getMeetId().getMeetName());
        return dto;
    }
    public List<EventResultDTO> getTop5PerformancesByLoggedInAthlete(String username) {
        Pageable top5 = PageRequest.of(0, 5);
        List<EventResult> results = eventResultRepository.findTop5ByAthlete_UsernameOrderByScoreDesc(username, top5);
        return results.stream()
                .map(this::toEventResultDTO)
                .collect(Collectors.toList());
    }
    public EventResultDTO getTopPerformanceByAthleteId(Long athleteId) {
        List<EventResult> results = eventResultRepository.findTopPerformanceByAthleteId(athleteId);
        if (results.isEmpty()) {
            throw new RuntimeException("No performance found for the athlete with ID: " + athleteId);
        }
        EventResult topPerformance = results.get(0);
        return toEventResultDTO(topPerformance);
    }
    public List<EventResultDTO> getAllResultsByLoggedInAthlete(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<EventResult> results = eventResultRepository.findAllByAthleteUsernameOrderByEventDateDesc(username, pageable);
        if (results.isEmpty()) {
            throw new RuntimeException("No performance");
        }
        return results.stream()
                .map(this::toEventResultDTO)
                .collect(Collectors.toList());
    }
    public List<EventResponseDTO> getApprovedRegistrationsWithoutResults(String username) {
        Date currentDate = new Date();
        Athlete athlete = athleteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Athlete not found"));
        List<Registration> approvedRegistrations = registrationRepository.findByAthlete_AthleteIdAndStatus(athlete.getAthleteId(), "Approved");
        return approvedRegistrations.stream()
                .filter(reg -> reg.getEvent().getEventDate().before(currentDate) &&
                        eventResultRepository.findByEventAndAthlete(reg.getEvent(), reg.getAthlete()).isEmpty())
                .map(reg -> {
                    Event event = reg.getEvent();
                    EventResponseDTO dto = new EventResponseDTO();
                    dto.setEventTitle(event.getEventTitle());
                    dto.setEventId(event.getEventId());
                    dto.setCategory(event.getCategory());
                    dto.setLocation(event.getLocation());
                    dto.setEventDate(event.getEventDate());
                    dto.setEventDescription(event.getEventDescription());
                    dto.setMeetId(event.getMeetId());
                    if (event.getImage() != null) {
                        dto.setImageBase64(Base64.getEncoder().encodeToString(event.getImage()));
                    } else {
                        dto.setImageBase64(null);
                    }
                    dto.setMeetName(event.getMeetId().getMeetName());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    public List<EventResponseDTO> getApprovedRegistrationsWithResults(String username) {
        Date currentDate = new Date();
        Athlete athlete = athleteRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Athlete not found"));
        List<Registration> approvedRegistrations = registrationRepository.findByAthlete_AthleteIdAndStatus(athlete.getAthleteId(), "Approved");
        return approvedRegistrations.stream()
                .filter(reg -> reg.getEvent().getEventDate().before(currentDate) &&
                        !eventResultRepository.findByEventAndAthlete(reg.getEvent(), reg.getAthlete()).isEmpty())
                .map(reg -> {
                    Event event = reg.getEvent();
                    EventResponseDTO dto = new EventResponseDTO();
                    dto.setEventTitle(event.getEventTitle());
                    dto.setEventId(event.getEventId());
                    dto.setCategory(event.getCategory());
                    dto.setLocation(event.getLocation());
                    dto.setEventDate(event.getEventDate());
                    dto.setEventDescription(event.getEventDescription());
                    dto.setMeetId(event.getMeetId());
                    if (event.getImage() != null) {
                        dto.setImageBase64(Base64.getEncoder().encodeToString(event.getImage()));
                    } else {
                        dto.setImageBase64(null);
                    }
                    dto.setMeetName(event.getMeetId().getMeetName());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}