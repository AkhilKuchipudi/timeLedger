package com.timeledger.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "workspace_settings")
@Data
public class WorkspaceSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String projectName;
    private String workspaceUrl;
    private boolean privateWorkspace;
    private boolean autoArchiveTasks;
    private int archiveThreshold;
    private boolean emailAlerts;
    private boolean slackIntegration;
    private boolean timerReminders;
}
