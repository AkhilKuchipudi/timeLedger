import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LeaveRequest {
  id?: number;
  userId?: number;
  user?: any;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  private apiUrl = 'http://localhost:8080/api/leave-requests';

  constructor(private http: HttpClient) { }

  getRequestsByUser(userId: number): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/user/${userId}`);
  }

  createRequest(request: LeaveRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(this.apiUrl, request);
  }

  updateStatus(id: number, status: string): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }
}
