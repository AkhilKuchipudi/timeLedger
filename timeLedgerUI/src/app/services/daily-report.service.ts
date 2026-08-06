import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DailyReport {
  id?: number;
  userId?: number;
  user?: any;
  date?: string;
  workLocation: string;
  shiftType: string;
  yesterdayWork: string;
  todayPlan: string;
  blockers: string;
}

@Injectable({
  providedIn: 'root'
})
export class DailyReportService {
  private apiUrl = 'http://localhost:8080/api/daily-reports';

  constructor(private http: HttpClient) { }

  getReport(userId: number, date?: string): Observable<DailyReport> {
    const url = date ? `${this.apiUrl}/user/${userId}?date=${date}` : `${this.apiUrl}/user/${userId}`;
    return this.http.get<DailyReport>(url);
  }

  saveReport(report: DailyReport): Observable<DailyReport> {
    return this.http.post<DailyReport>(this.apiUrl, report);
  }
}
