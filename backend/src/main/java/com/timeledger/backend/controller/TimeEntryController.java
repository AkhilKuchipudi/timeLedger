package com.timeledger.backend.controller;

import com.timeledger.backend.model.TimeEntry;
import com.timeledger.backend.service.TimeEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/time-entries")
@CrossOrigin(origins = "http://localhost:4200")
public class TimeEntryController {

    @Autowired
    private TimeEntryService timeEntryService;

    @GetMapping
    public List<TimeEntry> getAllEntries() {
        return timeEntryService.getAllEntries();
    }

    @PostMapping
    public ResponseEntity<TimeEntry> createEntry(@RequestBody TimeEntry entry) {
        return ResponseEntity.ok(timeEntryService.createEntry(entry));
    }

    @GetMapping("/user/{userId}")
    public List<TimeEntry> getEntriesByUser(@PathVariable Long userId) {
        try {
            return timeEntryService.getEntriesByUserId(userId);
        } catch (RuntimeException e) {
            return List.of();
        }
    }

    @GetMapping("/consistency/{userId}")
    public ResponseEntity<Double> getConsistencyScore(@PathVariable Long userId) {
        return ResponseEntity.ok(timeEntryService.getConsistencyScore(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeEntry> updateEntry(@PathVariable Long id, @RequestBody TimeEntry entryDetails) {
        try {
            return ResponseEntity.ok(timeEntryService.updateEntry(id, entryDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        timeEntryService.deleteEntry(id);
        return ResponseEntity.ok().build();
    }
}
