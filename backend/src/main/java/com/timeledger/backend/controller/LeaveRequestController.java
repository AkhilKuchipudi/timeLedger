package com.timeledger.backend.controller;

import com.timeledger.backend.model.LeaveRequest;
import com.timeledger.backend.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
@CrossOrigin(origins = "http://localhost:4200")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private com.timeledger.backend.repository.UserRepository userRepository;

    @Autowired
    private com.timeledger.backend.service.NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public List<LeaveRequest> getRequestsByUser(@PathVariable Long userId) {
        return leaveRequestRepository.findByUser_Id(userId);
    }

    @PostMapping
    public LeaveRequest createRequest(@RequestBody LeaveRequest request) {
        if (request.getUser() == null || request.getUser().getUsername() == null) {
            Long userId = request.getUser() != null ? request.getUser().getId() : request.getUserId();
            if (userId != null) {
                userRepository.findById(userId).ifPresent(request::setUser);
            }
        }
        return leaveRequestRepository.save(request);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequest> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return leaveRequestRepository.findById(id)
                .map(request -> {
                    request.setStatus(status);
                    LeaveRequest saved = leaveRequestRepository.save(request);
                    
                    // Create Notification
                    com.timeledger.backend.model.Notification note = new com.timeledger.backend.model.Notification();
                    note.setUser(request.getUser());
                    note.setTitle("Leave Request " + status);
                    note.setMessage("Your leave request for " + request.getStartDate() + " has been " + status.toLowerCase());
                    note.setType("info");
                    note.setCategory("LEAVE");
                    note.setTime(java.time.LocalDateTime.now());
                    note.setRead(false);
                    notificationService.createNotification(note);
                    
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
