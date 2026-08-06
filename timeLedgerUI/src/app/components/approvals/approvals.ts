import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../../services/manager.service';
import { LeaveRequestService } from '../../services/leave-request.service';
import { TimeEntryService } from '../../services/time-entry.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-approvals',
  standalone: false,
  templateUrl: './approvals.html',
  styleUrl: './approvals.scss'
})
export class Approvals implements OnInit {
  pendingLeaves: any[] = [];
  pendingTimesheets: any[] = [];
  isLoading = true;

  constructor(
    private managerService: ManagerService,
    private leaveRequestService: LeaveRequestService,
    private timeEntryService: TimeEntryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPendingRequests();
  }

  loadPendingRequests() {
    this.isLoading = true;
    this.managerService.getPendingRequests().subscribe({
      next: (data) => {
        this.pendingLeaves = data.leaves;
        this.pendingTimesheets = data.timesheets;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pending requests', err);
        this.isLoading = false;
      }
    });
  }

  approveLeave(id: number) {
    this.leaveRequestService.updateStatus(id, 'APPROVED').subscribe(() => {
      this.loadPendingRequests();
    });
  }

  rejectLeave(id: number) {
    this.leaveRequestService.updateStatus(id, 'REJECTED').subscribe(() => {
      this.loadPendingRequests();
    });
  }

  approveTimesheet(id: number) {
    // We need updateStatus for TimeEntry too, I'll add it to the service if needed
    // For now assume updateEntry can handle status change
    this.timeEntryService.updateEntry(id, { status: 'APPROVED' } as any).subscribe(() => {
      this.loadPendingRequests();
    });
  }

  rejectTimesheet(id: number) {
    this.timeEntryService.updateEntry(id, { status: 'REJECTED' } as any).subscribe(() => {
      this.loadPendingRequests();
    });
  }
}
