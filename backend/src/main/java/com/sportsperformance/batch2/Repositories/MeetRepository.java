package com.sportsperformance.batch2.Repositories;

import com.sportsperformance.batch2.models.Coach;
import com.sportsperformance.batch2.models.Meet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

//public interface MeetRepository {
//}
@Repository
public interface MeetRepository extends JpaRepository<Meet, Long> {
}