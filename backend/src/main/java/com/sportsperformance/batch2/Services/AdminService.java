package com.sportsperformance.batch2.Services;
import com.sportsperformance.batch2.DTO.*;
import com.sportsperformance.batch2.Repositories.*;
import com.sportsperformance.batch2.models.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;
@Service
public class AdminService {
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private MeetRepository meetRepository;
    private final String uploadDir = "uploads/images/";
    public Event createEvent(CreateEventDTO eventDTO) throws Exception {
        Optional<Meet> meetOptional = meetRepository.findById(eventDTO.getMeetId());
        if (meetOptional.isEmpty()) {
            throw new Exception("Meet with ID " + eventDTO.getMeetId() + " not found.");
        }
        Event event = new Event();
        event.setEventTitle(eventDTO.getEventTitle());
        event.setEventDate(eventDTO.getEventDate());
        event.setMeetId(meetOptional.get());
        event.setLocation(eventDTO.getLocation());
        event.setCategory(eventDTO.getCategory());
        event.setEventDescription(eventDTO.getEventDescription());
        MultipartFile imageFile = eventDTO.getImage();
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                event.setImage(imageFile.getBytes());
            } catch (IOException e) {
                throw new Exception("Failed to process image file: " + e.getMessage());
            }
        }
        return eventRepository.save(event);
    }
    public Meet createMeet(String meetName) {
        Meet meet = new Meet();
        meet.setMeetName(meetName);
        return meetRepository.save(meet);
    }
    public Optional<Meet> getMeetById(long meetId) {
        return meetRepository.findById(meetId);
    }
    public List<Meet> getAllMeets() {
        return meetRepository.findAll();
    }
    @Autowired
    private RegistrationRepository registrationRepository;
    public void updateRegistrationStatus(Long registrationId, String status) throws Exception {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new Exception("Registration not found"));
        registration.setStatus(status);
        registrationRepository.save(registration);
    }
    public List<RegistrationDTO> getAllRegistrations() {
        return registrationRepository.findAll()
                .stream()
                .map(registration -> {
                    AthleteProfileDTO athleteProfile = new AthleteProfileDTO();
                    athleteProfile.setFirstName(registration.getAthlete().getFirstName());
                    athleteProfile.setLastName(registration.getAthlete().getLastName());
                    athleteProfile.setBirthDate(registration.getAthlete().getBirthDate());
                    athleteProfile.setAthleteId(registration.getAthlete().getAthleteId());
                    athleteProfile.setGender(registration.getAthlete().getGender());
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
    @Autowired
    private AthleteRepository athleteRepository;
    public AthleteProfileDTO getAthleteById(Long athleteId) throws Exception {
        Athlete athlete = athleteRepository.findById(athleteId)
                .orElseThrow(() -> new Exception("Athlete not found"));
        AthleteProfileDTO athleteProfileDTO = new AthleteProfileDTO();
        athleteProfileDTO.setFirstName(athlete.getFirstName());
        athleteProfileDTO.setLastName(athlete.getLastName());
        athleteProfileDTO.setBirthDate(athlete.getBirthDate());
        athleteProfileDTO.setGender(athlete.getGender());
        athleteProfileDTO.setAthleteId(athlete.getAthleteId());
        athleteProfileDTO.setHeight(athlete.getHeight());
        athleteProfileDTO.setWeight(athlete.getWeight());
        athleteProfileDTO.setCategory(athlete.getCategory());
        if (athlete.getPhoto() != null) {
            byte[] photoBytes = athlete.getPhoto();
            athleteProfileDTO.setPhotoBase64(Base64.getEncoder().encodeToString(photoBytes));
        }
        return athleteProfileDTO;
    }
    public EventResponseDTO getEventById(Long eventId) throws Exception {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new Exception("Event not found"));
        EventResponseDTO eventResponseDTO = new EventResponseDTO();
        eventResponseDTO.setEventTitle(event.getEventTitle());
        eventResponseDTO.setEventId(event.getEventId());
        eventResponseDTO.setCategory(event.getCategory());
        eventResponseDTO.setLocation(event.getLocation());
        eventResponseDTO.setEventDate(event.getEventDate());
        eventResponseDTO.setEventDescription(event.getEventDescription());
        eventResponseDTO.setMeetId(event.getMeetId());
        if (event.getImage() != null) {
            byte[] imageBytes = event.getImage();
            eventResponseDTO.setImageBase64(Base64.getEncoder().encodeToString(imageBytes));
        }
        return eventResponseDTO;
    }
    public List<EventWithPendingResultDTO> getEventsWithPendingResults() {
        LocalDate today = LocalDate.now();
        return eventRepository.findAll().stream()
                .filter(event -> event.getEventDate()
                        .toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()
                        .isBefore(today)
                        && event.getEventResults().isEmpty())
                .map(event -> {
                    EventWithPendingResultDTO dto = new EventWithPendingResultDTO();
                    dto.setEventId(event.getEventId());
                    dto.setEventTitle(event.getEventTitle());
                    dto.setCategory(event.getCategory());
                    dto.setLocation(event.getLocation());
                    dto.setEventDate(event.getEventDate().toString());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    public List<AthleteResultDTO> getAthletesForEvent(Long eventId) {
        List<Registration> registrations = registrationRepository.findByEvent_EventIdAndStatus(eventId, "Approved");
        return registrations.stream().map(reg -> {
            AthleteResultDTO dto = new AthleteResultDTO();
            dto.setAthleteId(reg.getAthlete().getAthleteId());
            String name = reg.getAthlete().getFirstName() + " " + reg.getAthlete().getLastName();
            dto.setAthleteName(name);
            dto.setAthletePicture(Arrays.toString(reg.getAthlete().getPhoto()));
            if (reg.getAthlete().getPhoto() != null) {
                byte[] photoBytes = reg.getAthlete().getPhoto();
                dto.setAthletePicture(Base64.getEncoder().encodeToString(photoBytes));
            }
            reg.getEvent().getEventResults().stream()
                    .filter(result -> result.getAthlete().getAthleteId() == reg.getAthlete().getAthleteId())
                    .findFirst()
                    .ifPresent(result -> {
                        dto.setScore(result.getScore());
                        dto.setComment(result.getComment());
                    });
            return dto;
        }).collect(Collectors.toList());
    }
    @Autowired
    private EventResultRepository eventResultRepository;
    @Transactional
    public void saveEventResult(Long eventId, List<AthleteResultDTO> results) throws Exception {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new Exception("Event not found with ID: " + eventId));
        for (AthleteResultDTO resultDTO : results) {
            Registration registration = registrationRepository
                    .findByEvent_EventIdAndAthlete_AthleteIdAndStatus(eventId, resultDTO.getAthleteId(), "Approved")
                    .orElseThrow(() -> new Exception("Athlete not registered or approved for this event"));
            Optional<EventResult> existingResultOpt = eventResultRepository
                    .findByEvent_EventIdAndAthlete_AthleteId(eventId, resultDTO.getAthleteId());
            EventResult eventResult = existingResultOpt.orElse(new EventResult());
            eventResult.setEvent(event);
            eventResult.setAthlete(registration.getAthlete());
            eventResult.setScore(resultDTO.getScore());
            eventResult.setComment(resultDTO.getComment());
            eventResultRepository.save(eventResult);
        }
    }
    public List<RegistrationDTO> getPendingRegistrations() throws Exception {
        List<Registration> registrations = registrationRepository.findByStatus("Pending");
        if (registrations.isEmpty()) {
            throw new Exception("No pending registrations found");
        }
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
    public void deleteRegistrationById(Long registrationId) {
        if (!registrationRepository.existsById(registrationId)) {
            throw new NoSuchElementException("Registration not found.");
        }
        registrationRepository.deleteById(registrationId);
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
    public List<EventResponseDTO> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return events.stream()
                .map(this::mapToDTO)
                .toList();
    }
    public Event updateEvent(Long eventId, CreateEventDTO eventDTO) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setEventTitle(eventDTO.getEventTitle());
        event.setEventDate(eventDTO.getEventDate());
        event.setLocation(eventDTO.getLocation());
        event.setCategory(eventDTO.getCategory());
        event.setEventDescription(eventDTO.getEventDescription());
        if (eventDTO.getMeetId() != null) {
            Meet meet = meetRepository.findById(eventDTO.getMeetId())
                    .orElseThrow(() -> new RuntimeException("Meet not found"));
            event.setMeetId(meet);
        }
        if (eventDTO.getImage() != null && !eventDTO.getImage().isEmpty()) {
            try {
                event.setImage(eventDTO.getImage().getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Failed to process image", e);
            }
        }
        return eventRepository.save(event);
    }
    public void deleteEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new RuntimeException("Event not found");
        }
        eventRepository.deleteById(eventId);
    }
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
    public EventResultDTO getResultByAthleteIdAndEventId(Long athleteId, Integer eventId) {
        EventResult result = eventResultRepository.findByAthleteIdAndEventId(athleteId, eventId)
                .orElseThrow(() -> new RuntimeException("Result not found"));
        return toEventResultDTO(result);
    }
    public List<EventResultDTO> getLeaderboardByEventId(Integer eventId) {
        return getResultsByEventId(eventId);
    }
    private EventResultDTO toEventResultDTO(EventResult result) {
        EventResultDTO dto = new EventResultDTO();
        dto.setAthleteName(result.getAthlete().getFirstName() + " " + result.getAthlete().getLastName());
        dto.setAthleteId(result.getAthlete().getAthleteId());
        dto.setScore(result.getScore());
        dto.setComment(result.getComment());
        dto.setEventName(result.getEvent().getEventTitle());
        dto.setEventDate(result.getEvent().getEventDate());
        dto.setMeetName(result.getEvent().getMeetId().getMeetName());
        return dto;
    }
    public EventResultDTO getTopPerformanceByAthleteId(Long athleteId) {
        List<EventResult> results = eventResultRepository.findTopPerformanceByAthleteId(athleteId);
        if (results.isEmpty()) {
            throw new RuntimeException("No performance found for the athlete with ID: " + athleteId);
        }
        EventResult topPerformance = results.get(0);
        return toEventResultDTO(topPerformance);
    }
}