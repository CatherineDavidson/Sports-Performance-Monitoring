package com.sportsperformance.batch2.Repositories;

import com.sportsperformance.batch2.models.Achievement;
import com.sportsperformance.batch2.models.Coach;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByCoach(Coach coach);
}
