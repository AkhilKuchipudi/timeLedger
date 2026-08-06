package com.timeledger.backend.controller;

import com.timeledger.backend.model.LeaveBalance;
import com.timeledger.backend.repository.LeaveBalanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "http://localhost:4200")
public class LeaveBalanceController {
    @Autowired
    private LeaveBalanceRepository repository;

    @GetMapping("/user/{userId}")
    public List<LeaveBalance> getLeavesForUser(@PathVariable Long userId) {
        return repository.findByUser_Id(userId);
    }
}
