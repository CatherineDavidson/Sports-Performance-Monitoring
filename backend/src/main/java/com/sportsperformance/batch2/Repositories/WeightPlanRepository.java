package com.sportsperformance.batch2.Repositories;

import com.sportsperformance.batch2.models.WeightPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeightPlanRepository extends JpaRepository<WeightPlan, Long> {
    List<WeightPlan> findByAthleteAthleteId(Long athleteId);
}
