package com.sportsperformance.batch2.Services;
import com.sportsperformance.batch2.DTO.*;
import com.sportsperformance.batch2.Repositories.*;
import com.sportsperformance.batch2.models.*;
import com.sportsperformance.batch2.util.ImageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.security.PrivateKey;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class CoachService {
    @Autowired
    private CoachRepository coachRepository;
    public List<CoachSummaryDTO> getAllCoaches() {
        return coachRepository.findAll()
                .stream()
                .map(coach -> {
                    CoachSummaryDTO summary = new CoachSummaryDTO();
                    summary.setCoachId(coach.getCoachId());
                    summary.setFirstName(coach.getFirstName());
                    summary.setLastName(coach.getLastName());
                    summary.setExpertise(coach.getExpertise());
                    summary.setEmail(coach.getEmail());
                    summary.setImageBase64(ImageUtil.convertToBase64(coach.getImage()));
                    return summary;
                })
                .collect(Collectors.toList());
    }
    public CoachDTO getCoachById(Long id) {
        Coach coach = coachRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coach not found"));
        CoachDTO dto = new CoachDTO();
        dto.setCoachId(coach.getCoachId());
        dto.setFirstName(coach.getFirstName());
        dto.setLastName(coach.getLastName());
        dto.setEmail(coach.getEmail());
        dto.setUsername(coach.getUsername());
        dto.setExpertise(coach.getExpertise());
        dto.setImageBase64(ImageUtil.convertToBase64(coach.getImage()));
        return dto;
    }
    public CoachDTO getCoachProfile() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        Coach coach = coachRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Coach not found with username: " + username));
        CoachDTO dto = new CoachDTO();

        dto.setUsername(coach.getUsername());
        dto.setCoachId(coach.getCoachId());
        dto.setFirstName(coach.getFirstName());
        dto.setLastName(coach.getLastName());
        dto.setEmail(coach.getEmail());
        dto.setExpertise(coach.getExpertise());
        dto.setImageBase64(ImageUtil.convertToBase64(coach.getImage()));
        return dto;
    }
    public CoachDTO updateCoachProfileByUsername(CoachDTO coachDTO) throws IOException {
//        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = getLoggedInUsername();
        Coach coach = coachRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Coach not found with username: " + username));
        coach.setFirstName(coachDTO.getFirstName());
        coach.setLastName(coachDTO.getLastName());

//        coach.setUsername(coachDTO.getUsername());
//        coach.setEmail(coachDTO.getEmail());
        coach.setExpertise(coachDTO.getExpertise());
        if (coachDTO.getImageFile() != null && !coachDTO.getImageFile().isEmpty()) {
            coach.setImage(coachDTO.getImageFile().getBytes());
        }
        coachRepository.save(coach);
        CoachDTO updatedCoachDTO = new CoachDTO();
        updatedCoachDTO.setFirstName(coach.getFirstName());
        updatedCoachDTO.setLastName(coach.getLastName());

        updatedCoachDTO.setUsername(coach.getUsername());
        updatedCoachDTO.setEmail(coach.getEmail());
        updatedCoachDTO.setExpertise(coach.getExpertise());
        updatedCoachDTO.setImageBase64(coach.getImage() != null ?
                Base64.getEncoder().encodeToString(coach.getImage()) : null);
        return updatedCoachDTO;
    }
    @Autowired
    private AchievementRepository achievementRepository;
    private String getLoggedInUsername() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }
    public AchievementDTO addAchievement(AchievementDTO achievementDTO) {
        String username = getLoggedInUsername();
        Coach coach = coachRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Coach not found with username: " + username));
        Achievement achievement = new Achievement();
        achievement.setCoach(coach);
        achievement.setTitle(achievementDTO.getTitle());
        achievement.setDescription(achievementDTO.getDescription());
        achievement.setAchievedDate(achievementDTO.getAchievedDate());
        Achievement savedAchievement = achievementRepository.save(achievement);
        return mapToDTO(savedAchievement);
    }
    public AchievementDTO updateAchievement(Long achievementId, AchievementDTO achievementDTO) {
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new RuntimeException("Achievement not found with ID: " + achievementId));
        achievement.setTitle(achievementDTO.getTitle());
        achievement.setDescription(achievementDTO.getDescription());
        achievement.setAchievedDate(achievementDTO.getAchievedDate());
        Achievement updatedAchievement = achievementRepository.save(achievement);
        return mapToDTO(updatedAchievement);
    }
    public void deleteAchievement(Long achievementId) {
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new RuntimeException("Achievement not found with ID: " + achievementId));
        achievementRepository.delete(achievement);
    }
    public AchievementDTO getAchievementById(Long achievementId) {
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new RuntimeException("Achievement not found with ID: " + achievementId));
        return mapToDTO(achievement);
    }
    public List<AchievementDTO> getAllAchievementsByLoggedInCoach() {
        String username = getLoggedInUsername();
        Coach coach = coachRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Coach not found with username: " + username));
        return achievementRepository.findByCoach(coach).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    public List<AchievementDTO> getAllAchievementsByCoachId(Long coachId) {
        Coach coach = coachRepository.findById(coachId)
                .orElseThrow(() -> new RuntimeException("Coach not found with ID: " + coachId));
        return achievementRepository.findByCoach(coach).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    private AchievementDTO mapToDTO(Achievement achievement) {
        AchievementDTO achievementDTO = new AchievementDTO();
        achievementDTO.setAchievementId(achievement.getAchievementId());
        achievementDTO.setTitle(achievement.getTitle());
        achievementDTO.setDescription(achievement.getDescription());
        achievementDTO.setAchievedDate(achievement.getAchievedDate());
        return achievementDTO;
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
    @Autowired
    private AthleteRepository athleteRepository;
    @Autowired
    private AssistanceRequestRepository assistanceRequestRepository;
    public void acceptRequest(Long requestId) {
        AssistanceRequest request = assistanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found with ID: " + requestId));
        request.setStatus("Accepted");
        Athlete athlete = request.getAthlete();
        athlete.setCoach(request.getCoach());
        athleteRepository.save(athlete);
        assistanceRequestRepository.save(request);
    }
    public void rejectRequest(Long requestId) {
        AssistanceRequest request = assistanceRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found with ID: " + requestId));
        request.setStatus("Rejected");
        assistanceRequestRepository.save(request);
    }
    public List<AssistanceRequestDTO> getRequestsByLoggedInCoach() {
        String username = getLoggedInUsername();
        Coach coach = coachRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Coach not found with username: " + username));
        return assistanceRequestRepository.findByCoach(coach).stream()
                .map(request -> {
                    AssistanceRequestDTO dto = mapToDTO(request);
                    AthleteProfileDTO athleteProfile = new AthleteProfileDTO();
                    athleteProfile.setFirstName(request.getAthlete().getFirstName());
                    athleteProfile.setLastName(request.getAthlete().getLastName());
                    athleteProfile.setBirthDate(request.getAthlete().getBirthDate());
                    athleteProfile.setGender(request.getAthlete().getGender());
                    athleteProfile.setAthleteId(request.getAthlete().getAthleteId());
                    athleteProfile.setHeight(request.getAthlete().getHeight());
                    athleteProfile.setWeight(request.getAthlete().getWeight());
                    athleteProfile.setCategory(request.getAthlete().getCategory());
                    athleteProfile.setPhotoBase64(Arrays.toString(request.getAthlete().getPhoto()));
                    if (request.getAthlete().getPhoto() != null) {
                        byte[] photoBytes = request.getAthlete().getPhoto();
                        athleteProfile.setPhotoBase64(Base64.getEncoder().encodeToString(photoBytes));
                    } else {
                        athleteProfile.setPhotoBase64(null);
                    }
                    athleteProfile.setEmail(request.getAthlete().getEmail());
                    athleteProfile.setUsername(request.getAthlete().getUsername());
                    dto.setAthleteId((Long) request.getAthlete().getAthleteId());
                    dto.setAthlete(athleteProfile);
                    return dto;
                })
                .collect(Collectors.toList());
    }
    @Autowired
    private WeightPlanRepository weightPlanRepository;
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
    private DailyDietRepository dailyDietRepository;
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
    public WeightPlanDTO createWeightPlan(WeightPlanDTO dto) {
        Athlete athlete = athleteRepository.findById((Long)dto.getAthleteId())
                .orElseThrow(() -> new RuntimeException("Athlete not found"));
        if (athlete.getWeightPlan() != null) {
            throw new RuntimeException("Athlete already has an existing weight plan, updated now.");
        }
        WeightPlan weightPlan = new WeightPlan();
        weightPlan.setAthlete(athlete);
        weightPlan.setStartWeight(dto.getStartWeight());
        weightPlan.setTargetWeight(dto.getTargetWeight());
        weightPlan.setPreference(dto.getPreference());
        weightPlan.setDailyCalorieGoal(dto.getDailyCalorieGoal());
        weightPlan = weightPlanRepository.save(weightPlan);
        athlete.setWeightPlan(weightPlan);
        athleteRepository.save(athlete);
        return mapToDTO(weightPlan);
    }
    public WeightPlanDTO getWeightPlanByAthlete(Long athleteId) {
        Athlete athlete = athleteRepository.findById(athleteId)
                .orElseThrow(() -> new RuntimeException("Athlete not found"));
        WeightPlan weightPlan = athlete.getWeightPlan();
        if (weightPlan == null) {
            throw new RuntimeException("No weight plan found for the athlete");
        }
        return mapToDTO(weightPlan);
    }
    public WeightPlanDTO updateWeightPlan(Long athleteId, WeightPlanDTO dto) {
        Athlete athlete = athleteRepository.findById(athleteId)
                .orElseThrow(() -> new RuntimeException("Athlete not found"));
        athlete.getWeightPlan().setStartWeight(dto.getStartWeight());
        athlete.getWeightPlan().setTargetWeight(dto.getTargetWeight());
        athlete.getWeightPlan().setPreference(dto.getPreference());
        athlete.getWeightPlan().setDailyCalorieGoal(dto.getDailyCalorieGoal());
        athleteRepository.save(athlete);
        weightPlanRepository.save(athlete.getWeightPlan());
        return mapToDTO(athlete.getWeightPlan());
    }
    public void deleteWeightPlan(Long planId) {
        weightPlanRepository.deleteById(planId);
    }
    public DailyDietDTO createDailyDiet(DailyDietDTO dto) {
        Athlete athlete = athleteRepository.findById(dto.getAthleteId())
                .orElseThrow(() -> new RuntimeException("Athlete not found"));
        DailyDiet dailyDiet = new DailyDiet();
        dailyDiet.setAthlete(athlete);
        dailyDiet.setDate(dto.getDate());
        dailyDiet.setCalories(dto.getCalories());
        dailyDiet.setProtein(dto.getProtein());
        dailyDiet.setFat(dto.getFat());
        dailyDiet.setCarbohydrate(dto.getCarbohydrate());
        dailyDiet.setFibre(dto.getFibre());
        dailyDiet.setWater(dto.getWater());
        WeightPlan weightPlan = athlete.getWeightPlan();
        if (weightPlan != null) {
            dailyDiet.setWeightPlan(weightPlan);
        } else {
            throw new RuntimeException("No WeightPlan found for the Athlete");
        }
        dailyDiet = dailyDietRepository.save(dailyDiet);
        return mapToDTO(dailyDiet);
    }
    public List<DailyDietDTO> getDailyDietsByAthlete(Long athleteId) {
        return dailyDietRepository.findByAthleteAthleteIdOrderByDateDesc(athleteId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    public void deleteDailyDiet(Long dietId) {
        dailyDietRepository.deleteById(dietId);
    }
    public List<AthleteProfileDTO> getAthletesForCoach() {
        Coach coach = coachRepository.findByUsername(getLoggedInUsername())
                .orElseThrow(() -> new RuntimeException("Coach not found"));
        List<AssistanceRequest> allRequests = assistanceRequestRepository.findByCoach(coach);
        return allRequests.stream()
                .filter(request -> "Accepted".equals(request.getStatus()))
                .map(request -> {
                    var athlete = request.getAthlete();
                    AthleteProfileDTO dto = new AthleteProfileDTO();
                    dto.setFirstName(athlete.getFirstName());
                    dto.setLastName(athlete.getLastName());
                    dto.setBirthDate(athlete.getBirthDate());
                    dto.setGender(athlete.getGender());
                    dto.setAthleteId(athlete.getAthleteId());
                    dto.setHeight(athlete.getHeight());
                    dto.setWeight(athlete.getWeight());
                    dto.setCategory(athlete.getCategory());
                    dto.setEmail(athlete.getEmail());
                    dto.setUsername(athlete.getUsername());
//                    dto.setPhotoBase64(Arrays.toString(athlete.getPhoto()));
                    if (athlete.getPhoto() != null) {
                        byte[] photoBytes = athlete.getPhoto();
                        dto.setPhotoBase64(Base64.getEncoder().encodeToString(photoBytes));
                    } else {
                        dto.setPhotoBase64(null);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }
}