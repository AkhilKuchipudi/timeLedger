import { Component, OnInit, signal } from '@angular/core';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-admin-logs',
  standalone: false,
  templateUrl: './admin-logs.html',
  styleUrls: ['./admin-logs.scss']
})
export class AdminLogs implements OnInit {
  logs = signal<any[]>([]);

  constructor(private logService: LogService) {}

  ngOnInit() {
    this.logService.getLogs().subscribe({
      next: (data) => {
        this.logs.set(data);
      },
      error: (err) => {
        console.error('Failed to fetch system logs:', err);
      }
    });
  }
}
