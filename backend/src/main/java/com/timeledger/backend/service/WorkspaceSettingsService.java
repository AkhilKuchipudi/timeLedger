package com.timeledger.backend.service;

import com.timeledger.backend.model.WorkspaceSettings;
import com.timeledger.backend.repository.WorkspaceSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WorkspaceSettingsService {
    @Autowired
    private WorkspaceSettingsRepository repository;

    public WorkspaceSettings getSettings() {
        return repository.findAll().stream().findFirst().orElse(createDefaultSettings());
    }

    public WorkspaceSettings updateSettings(WorkspaceSettings settings) {
        WorkspaceSettings existing = getSettings();
        settings.setId(existing.getId());
        return repository.save(settings);
    }

    private WorkspaceSettings createDefaultSettings() {
        WorkspaceSettings settings = new WorkspaceSettings();
        settings.setProjectName("TimeLedger Enterprise");
        settings.setWorkspaceUrl("timeledger-corp.app");
        settings.setPrivateWorkspace(true);
        settings.setAutoArchiveTasks(true);
        settings.setArchiveThreshold(30);
        settings.setEmailAlerts(true);
        settings.setSlackIntegration(true);
        settings.setTimerReminders(true);
        return repository.save(settings);
    }
}
