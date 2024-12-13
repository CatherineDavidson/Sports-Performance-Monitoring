package com.sportsperformance.batch2.Repositories;

import com.sportsperformance.batch2.models.Athlete;
import com.sportsperformance.batch2.models.Event;
import com.sportsperformance.batch2.models.EventResult;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventResultRepository extends JpaRepository<EventResult, Integer> {
    Optional<EventResult> findByEvent_EventIdAndAthlete_AthleteId(Long eventId, Long athleteId);


        List<EventResult> findByAthleteUsernameOrderByEvent_EventDateDesc(String username);

        @Query("SELECT er FROM EventResult er WHERE er.athlete.athleteId = :athleteId ORDER BY er.event.eventDate DESC")
        List<EventResult> findByAthleteId(@Param("athleteId") Long athleteId);

        @Query("SELECT er FROM EventResult er WHERE er.event.eventId = :eventId ORDER BY er.score DESC")
        List<EventResult> findByEventId(@Param("eventId") Integer eventId);

        @Query("SELECT er FROM EventResult er WHERE er.athlete.athleteId = :athleteId AND er.event.eventId = :eventId")
        Optional<EventResult> findByAthleteIdAndEventId(@Param("athleteId") Long athleteId, @Param("eventId") Integer eventId);

    @Query("SELECT er FROM EventResult er WHERE er.athlete.athleteId = :athleteId ORDER BY er.score DESC")
    List<EventResult> findTopPerformanceByAthleteId(@Param("athleteId") Long athleteId);

//    @Query("SELECT new com.sportsperformance.batch2.DTO.EventResultDTO(er.athlete.athleteId, er.score, er.comment, er.event.eventName, er.event.meetName) " +
//            "FROM EventResult er WHERE er.athlete.username = :username ORDER BY er.event.eventDate DESC")
//    List<EventResult> findTopPerformanceByUsername(@Param("username") String username);

    @Query("SELECT er FROM EventResult er WHERE er.athlete.username = :username ORDER BY er.score DESC")
    List<EventResult> findTop5ByAthlete_UsernameOrderByScoreDesc(String username, Pageable pageable);

    @Query("SELECT er FROM EventResult er WHERE er.athlete.username = :username ORDER BY er.event.eventDate DESC")
    List<EventResult> findAllByAthleteUsernameOrderByEventDateDesc(@Param("username") String username, Pageable pageable);


    List<EventResult> findByEventAndAthlete(Event event, Athlete athlete);

}
