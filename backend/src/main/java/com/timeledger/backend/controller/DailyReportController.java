package com.timeledger.backend.controller;

import com.timeledger.backend.model.DailyReport;
import com.timeledger.backend.repository.DailyReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/daily-reports")
@CrossOrigin(origins = "http://localhost:4200")
public class DailyReportController {

    @Autowired
    private DailyReportRepository dailyReportRepository;

    @Autowired
    private com.timeledger.backend.repository.UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<DailyReport> getReport(@PathVariable Long userId, @RequestParam(required = false) String date) {
        LocalDate reportDate = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        return dailyReportRepository.findByUser_IdAndDate(userId, reportDate)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DailyReport> saveReport(@RequestBody DailyReport report) {
        Long userId = report.getUser() != null ? report.getUser().getId() : report.getUserId();
        if (userId == null) return ResponseEntity.badRequest().build();
        
        LocalDate date = report.getDate() != null ? report.getDate() : LocalDate.now();
        
        return ResponseEntity.ok(dailyReportRepository.findByUser_IdAndDate(userId, date)
                .map(existing -> {
                    existing.setWorkLocation(report.getWorkLocation());
                    existing.setShiftType(report.getShiftType());
                    existing.setYesterdayWork(report.getYesterdayWork());
                    existing.setTodayPlan(report.getTodayPlan());
                    existing.setBlockers(report.getBlockers());
                    return dailyReportRepository.save(existing);
                })
                .orElseGet(() -> {
                    if (report.getUser() == null || report.getUser().getUsername() == null) {
                        userRepository.findById(userId).ifPresent(report::setUser);
                    }
                    return dailyReportRepository.save(report);
                }));
    }
}
