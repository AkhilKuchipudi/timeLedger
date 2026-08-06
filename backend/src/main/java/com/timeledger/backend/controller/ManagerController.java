package com.timeledger.backend.controller;

import com.timeledger.backend.model.LeaveRequest;
import com.timeledger.backend.model.TimeEntry;
import com.timeledger.backend.repository.LeaveRequestRepository;
import com.timeledger.backend.repository.TimeEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "http://localhost:4200")
public class ManagerController {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private TimeEntryRepository timeEntryRepository;

    @GetMapping("/pending-requests")
    public Map<String, Object> getPendingRequests() {
        Map<String, Object> result = new HashMap<>();
        
        List<LeaveRequest> pendingLeaves = leaveRequestRepository.findAll().stream()
                .filter(r -> "PENDING".equals(r.getStatus()))
                .collect(Collectors.toList());
                
        List<TimeEntry> pendingTimesheets = timeEntryRepository.findAll().stream()
                .filter(r -> "PENDING".equals(r.getStatus()))
                .collect(Collectors.toList());
                
        result.put("leaves", pendingLeaves);
        result.put("timesheets", pendingTimesheets);
        
        return result;
    }
}
