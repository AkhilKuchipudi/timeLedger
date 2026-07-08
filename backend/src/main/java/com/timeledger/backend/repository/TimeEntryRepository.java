package com.timeledger.backend.repository;

import com.timeledger.backend.model.TimeEntry;
import com.timeledger.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {
    List<TimeEntry> findByUser(User user);
    List<TimeEntry> findByUserAndStartTimeBetween(User user, LocalDateTime start, LocalDateTime end);
}
