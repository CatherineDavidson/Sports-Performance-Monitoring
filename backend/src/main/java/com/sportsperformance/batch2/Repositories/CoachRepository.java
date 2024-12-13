package com.sportsperformance.batch2.Repositories;

import com.sportsperformance.batch2.models.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoachRepository extends JpaRepository<Coach, Long> {
    Optional<Coach> findByEmail(String email);
    Optional<Coach> findByUsername(String username);
}