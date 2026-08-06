package com.timeledger.backend.controller;

import com.timeledger.backend.model.SystemLog;
import com.timeledger.backend.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SystemLogController {

    @Autowired
    private SystemLogRepository systemLogRepository;

    @GetMapping
    public ResponseEntity<List<SystemLog>> getAllLogs() {
        return ResponseEntity.ok(systemLogRepository.findAllByOrderByTimestampDesc());
    }
}
