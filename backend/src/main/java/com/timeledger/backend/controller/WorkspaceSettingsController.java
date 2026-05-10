package com.timeledger.backend.controller;

import com.timeledger.backend.model.WorkspaceSettings;
import com.timeledger.backend.service.WorkspaceSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:4200")
public class WorkspaceSettingsController {
    @Autowired
    private WorkspaceSettingsService service;

    @GetMapping
    public WorkspaceSettings getSettings() {
        return service.getSettings();
    }

    @PutMapping
    public WorkspaceSettings updateSettings(@RequestBody WorkspaceSettings settings) {
        return service.updateSettings(settings);
    }
}
