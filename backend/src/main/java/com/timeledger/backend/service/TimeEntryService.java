package com.timeledger.backend.service;

import com.timeledger.backend.model.TimeEntry;
import com.timeledger.backend.model.User;
import com.timeledger.backend.repository.TimeEntryRepository;
import com.timeledger.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TimeEntryService {

    @Autowired
    private TimeEntryRepository timeEntryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TimeEntry> getAllEntries() {
        return timeEntryRepository.findAll();
    }

    public List<TimeEntry> getEntriesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return timeEntryRepository.findByUser(user);
    }

    public TimeEntry createEntry(TimeEntry entry) {
        if (entry.getUser() == null && entry.getUserId() != null) {
            userRepository.findById(entry.getUserId()).ifPresent(entry::setUser);
        }
        
        if (entry.getStartTime() != null && entry.getEndTime() != null) {
            long minutes = Duration.between(entry.getStartTime(), entry.getEndTime()).toMinutes();
            entry.setDurationMinutes(minutes);
        }
        if (entry.getStatus() == null) {
            entry.setStatus("PENDING");
        }
        return timeEntryRepository.save(entry);
    }

    public Optional<TimeEntry> getEntryById(Long id) {
        return timeEntryRepository.findById(id);
    }

    public void deleteEntry(Long id) {
        timeEntryRepository.deleteById(id);
    }

    public double getConsistencyScore(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<TimeEntry> lastWeekEntries = timeEntryRepository.findByUserAndStartTimeBetween(
            user, sevenDaysAgo, LocalDateTime.now()
        );

        if (lastWeekEntries.isEmpty()) {
            return 0.0;
        }

        long totalMinutes = lastWeekEntries.stream()
                .filter(e -> e.getDurationMinutes() != null)
                .mapToLong(TimeEntry::getDurationMinutes)
                .sum();

        // Assuming 40 hours (2400 mins) a week is 100% consistency
        double score = (totalMinutes / 2400.0) * 100;
        return Math.min(score, 100.0);
    }

    public TimeEntry updateEntry(Long id, TimeEntry entryDetails) {
        TimeEntry entry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Time entry not found with id: " + id));
        
        entry.setProject(entryDetails.getProject());
        entry.setDescription(entryDetails.getDescription());
        entry.setStartTime(entryDetails.getStartTime());
        entry.setEndTime(entryDetails.getEndTime());
        entry.setTaskId(entryDetails.getTaskId());
        entry.setStatus(entryDetails.getStatus());
        
        if (entry.getStartTime() != null && entry.getEndTime() != null) {
            long minutes = Duration.between(entry.getStartTime(), entry.getEndTime()).toMinutes();
            entry.setDurationMinutes(minutes);
        }
        
        return timeEntryRepository.save(entry);
    }
}
