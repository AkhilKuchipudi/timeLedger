import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = 'http://localhost:8080/api/manager';

  constructor(private http: HttpClient) { }

  getPendingRequests(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pending-requests`);
  }
}
