import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WorkspaceSettings {
  id?: number;
  projectName: string;
  workspaceUrl: string;
  privateWorkspace: boolean;
  autoArchiveTasks: boolean;
  archiveThreshold: number;
  emailAlerts: boolean;
  slackIntegration: boolean;
  timerReminders: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private apiUrl = 'http://localhost:8080/api/settings';

  constructor(private http: HttpClient) { }

  getSettings(): Observable<WorkspaceSettings> {
    return this.http.get<WorkspaceSettings>(this.apiUrl);
  }

  updateSettings(settings: WorkspaceSettings): Observable<WorkspaceSettings> {
    return this.http.put<WorkspaceSettings>(this.apiUrl, settings);
  }
}
