import { Component, OnInit } from '@angular/core';
import { WorkspaceService, WorkspaceSettings } from '../../services/workspace.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  projectConfig: any = {};
  notificationSettings: any = {};

  constructor(private workspaceService: WorkspaceService) {}

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.workspaceService.getSettings().subscribe(settings => {
      this.projectConfig = {
        name: settings.projectName,
        workspaceUrl: settings.workspaceUrl,
        privateWorkspace: settings.privateWorkspace,
        autoArchiveTasks: settings.autoArchiveTasks,
        archiveThreshold: settings.archiveThreshold
      };
      this.notificationSettings = {
        emailAlerts: settings.emailAlerts,
        slackIntegration: settings.slackIntegration,
        timerReminders: settings.timerReminders
      };
    });
  }

  saveSettings() {
    const updated: WorkspaceSettings = {
      projectName: this.projectConfig.name,
      workspaceUrl: this.projectConfig.workspaceUrl,
      privateWorkspace: this.projectConfig.privateWorkspace,
      autoArchiveTasks: this.projectConfig.autoArchiveTasks,
      archiveThreshold: this.projectConfig.archiveThreshold,
      emailAlerts: this.notificationSettings.emailAlerts,
      slackIntegration: this.notificationSettings.slackIntegration,
      timerReminders: this.notificationSettings.timerReminders
    };

    this.workspaceService.updateSettings(updated).subscribe(() => {
      alert('Settings saved successfully!');
    });
  }
}
