package com.sportsperformance.batch2.Repositories;

import com.sportsperformance.batch2.models.Event;
import com.sportsperformance.batch2.models.Meet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
//    Optional<Event> findById(Long id);
}