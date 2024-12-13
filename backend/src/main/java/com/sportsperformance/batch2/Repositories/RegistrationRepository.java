package com.sportsperformance.batch2.Repositories;

import com.sportsperformance.batch2.models.Athlete;
import com.sportsperformance.batch2.models.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    Optional<Registration> findById(Long id);
    List<Registration> findByAthlete(Athlete athlete);
    List<Registration> findByEvent_EventIdAndStatus(Long eventId, String status);
    Optional<Registration> findByEvent_EventIdAndAthlete_AthleteIdAndStatus(Long eventId, Long athleteId, String status);

    @Query(value = "SELECT CAST(event_id AS UNSIGNED) FROM registration WHERE athlete_id = :athleteId", nativeQuery = true)
    List<Integer> findEventIdsByAthleteId(@Param("athleteId") Long athleteId);

    List<Registration> findByAthlete_AthleteIdAndStatus(Long athleteId, String status);


    List<Registration> findByStatus(String status);

}