import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TimeEntry {
  id?: number;
  userId: number;
  taskId?: string;
  project: string;
  description: string;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TimeEntryService {
  private apiUrl = 'http://localhost:8080/api/time-entries';

  constructor(private http: HttpClient) { }

  getAllEntries(): Observable<TimeEntry[]> {
    return this.http.get<TimeEntry[]>(this.apiUrl);
  }

  getEntriesByUser(userId: number): Observable<TimeEntry[]> {
    return this.http.get<TimeEntry[]>(`${this.apiUrl}/user/${userId}`);
  }

  createEntry(entry: TimeEntry): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(this.apiUrl, entry);
  }

  updateEntry(id: number, entry: TimeEntry): Observable<TimeEntry> {
    return this.http.put<TimeEntry>(`${this.apiUrl}/${id}`, entry);
  }

  deleteEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
