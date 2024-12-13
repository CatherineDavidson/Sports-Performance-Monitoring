package com.sportsperformance.batch2.Repositories;

import com.sportsperformance.batch2.models.DailyDiet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DailyDietRepository extends JpaRepository<DailyDiet, Long> {
    List<DailyDiet> findByAthleteAthleteIdOrderByDateDesc(Long athleteId);
}
