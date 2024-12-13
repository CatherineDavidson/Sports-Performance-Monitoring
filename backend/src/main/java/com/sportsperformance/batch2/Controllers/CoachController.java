package com.sportsperformance.batch2.Controllers;
import com.sportsperformance.batch2.DTO.*;
import com.sportsperformance.batch2.Repositories.AssistanceRequestRepository;
import com.sportsperformance.batch2.Repositories.AthleteRepository;
import com.sportsperformance.batch2.Repositories.WeightPlanRepository;
import com.sportsperformance.batch2.Services.AdminService;
import com.sportsperformance.batch2.Services.AthleteService;
import com.sportsperformance.batch2.Services.CoachService;
import com.sportsperformance.batch2.models.Athlete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/coach")
public class CoachController {
    @Autowired
    private CoachService coachService;
    @GetMapping("/getallcoach")
    public ResponseEntity<List<CoachSummaryDTO>> getAllCoaches() {
        return ResponseEntity.ok(coachService.getAllCoaches());
    }
    @GetMapping("/{id}")
    public ResponseEntity<CoachDTO> getCoachById(@PathVariable Long id) {
        return ResponseEntity.ok(coachService.getCoachById(id));
    }
    @GetMapping("/profile")
    public ResponseEntity<CoachDTO> getCoaachProfile() {
        return ResponseEntity.ok(coachService.getCoachProfile());
    }
    @PutMapping(value = "/profile", consumes = "multipart/form-data")
    public ResponseEntity<CoachDTO> updateCoachProfile(
            @ModelAttribute CoachDTO coachDTO) throws IOException {
        return ResponseEntity.ok(coachService.updateCoachProfileByUsername(coachDTO));
    }
    @PostMapping("/addAchievement")
    public ResponseEntity<AchievementDTO> addAchievement(@RequestBody AchievementDTO achievementDTO) {
        return ResponseEntity.ok(coachService.addAchievement(achievementDTO));
    }
    @PutMapping("/achievement/{achievementId}")
    public ResponseEntity<AchievementDTO> updateAchievement(
            @PathVariable Long achievementId,
            @RequestBody AchievementDTO achievementDTO) {
        return ResponseEntity.ok(coachService.updateAchievement(achievementId, achievementDTO));
    }
    @DeleteMapping("/achievement/{achievementId}")
    public ResponseEntity<Void> deleteAchievement(@PathVariable Long achievementId) {
        coachService.deleteAchievement(achievementId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/achievement/{achievementId}")
    public ResponseEntity<AchievementDTO> getAchievementById(@PathVariable Long achievementId) {
        return ResponseEntity.ok(coachService.getAchievementById(achievementId));
    }
    @GetMapping("/achievements")
    public ResponseEntity<List<AchievementDTO>> getAllAchievementsByLoggedInCoach() {
        return ResponseEntity.ok(coachService.getAllAchievementsByLoggedInCoach());
    }
    @GetMapping("achievements/coach/{coachId}")
    public ResponseEntity<List<AchievementDTO>> getAllAchievementsByCoachId(@PathVariable Long coachId) {
        return ResponseEntity.ok(coachService.getAllAchievementsByCoachId(coachId));
    }
    @Autowired
    private AssistanceRequestRepository assistanceRequestRepository;
    @Autowired
    private AthleteRepository athleteRepository;
    @GetMapping("/getallassistancereq")
    public ResponseEntity<List<AssistanceRequestDTO>> getRequestsByLoggedInCoach() {
        return ResponseEntity.ok(coachService.getRequestsByLoggedInCoach());
    }
    @PutMapping("assistance/{requestId}/accept")
    public ResponseEntity<Void> acceptRequest(@PathVariable Long requestId) {
        coachService.acceptRequest(requestId);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("assistance/{requestId}/reject")
    public ResponseEntity<Void> rejectRequest(@PathVariable Long requestId) {
        coachService.rejectRequest(requestId);
        return ResponseEntity.noContent().build();
    }
    @Autowired
    private WeightPlanRepository weightPlanRepository;
    @PostMapping("/createplan")
    public WeightPlanDTO createWeightPlan(@RequestBody WeightPlanDTO dto) {
        return coachService.createWeightPlan(dto);
    }
    @PutMapping("updateplan/{athleteId}")
    public WeightPlanDTO updateWeightPlan(@PathVariable Long athleteId, @RequestBody WeightPlanDTO dto) {
        return coachService.updateWeightPlan(athleteId, dto);
    }
    @DeleteMapping("deleteplan/{planId}")
    public void deleteWeightPlan(@PathVariable Long planId) {
        coachService.deleteWeightPlan(planId);
    }
    @PostMapping("/creatediet")
    public DailyDietDTO createDailyDiet(@RequestBody DailyDietDTO dto) {
        return coachService.createDailyDiet(dto);
    }
    @DeleteMapping("deletediet/{dietId}")
    public void deleteDailyDiet(@PathVariable Long dietId) {
        coachService.deleteDailyDiet(dietId);
    }
    @GetMapping("weightplan/athlete/{athleteId}")
    public WeightPlanDTO getWeightPlans(@PathVariable Long athleteId) {
        return coachService.getWeightPlanByAthlete(athleteId);
    }
    @GetMapping("diet/athlete/{athleteId}")
    public List<DailyDietDTO> getDailyDiets(@PathVariable Long athleteId) {
        return coachService.getDailyDietsByAthlete(athleteId);
    }
    @Autowired
    AdminService adminService;
    @GetMapping("/athlete/{athleteId}")
    public ResponseEntity<AthleteProfileDTO> getAthlete(@PathVariable Long athleteId) {
        try {
            AthleteProfileDTO athlete = adminService.getAthleteById(athleteId);
            return ResponseEntity.ok(athlete);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }
    @GetMapping("/athletes")
    public List<AthleteProfileDTO> getAthletes() {
        return coachService.getAthletesForCoach();
    }
    @GetMapping("/result/by-athlete/{athleteId}")
    public ResponseEntity<List<EventResultDTO>> getResultsByAthleteId(@PathVariable Long athleteId) {
        List<EventResultDTO> results = adminService.getResultsByAthleteId(athleteId);
        return ResponseEntity.ok(results);
    }


    private String getLoggedInUsername() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUsername();
    }

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