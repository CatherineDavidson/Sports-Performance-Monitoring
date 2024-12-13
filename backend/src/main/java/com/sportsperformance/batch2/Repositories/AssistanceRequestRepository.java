package com.sportsperformance.batch2.Repositories;

import com.sportsperformance.batch2.models.Athlete;
import com.sportsperformance.batch2.models.AssistanceRequest;
import com.sportsperformance.batch2.models.Coach;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssistanceRequestRepository extends JpaRepository<AssistanceRequest, Long> {
    AssistanceRequest findByAthlete(Athlete athlete);
    List<AssistanceRequest> findByCoach(Coach coach);
//    List<AssistanceRequest> findByCoachIdAndStatus(Coach coach, String status);

}
