import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { TimeEntryService, TimeEntry } from '../../services/time-entry.service';
import { AuthService } from '../../services/auth.service';
import { LeaveService, LeaveBalance } from '../../services/leave.service';
import { DailyReportService, DailyReport } from '../../services/daily-report.service';
import { LeaveRequestService, LeaveRequest } from '../../services/leave-request.service';

@Component({
  selector: 'app-timesheets',
  standalone: false,
  templateUrl: './timesheets.html',
  styleUrl: './timesheets.scss',
})
export class Timesheets implements OnInit {
  constructor(
    private seoService: SeoService,
    private timeEntryService: TimeEntryService,
    private authService: AuthService,
    private leaveService: LeaveService,
    private dailyReportService: DailyReportService,
    private leaveRequestService: LeaveRequestService
  ) {}

  ngOnInit() {
    this.seoService.updateTitle('Timesheet');
    this.seoService.updateMetaTags(
      'Track your daily work hours, manage punch-in/out times, and view your work history with the TimeLedger Timesheet.',
      'timesheet, work hours, punch in, punch out, time tracking'
    );
    this.loadHistory();
    this.loadLeaveBalances();
    this.loadDailyReport();
  }

  currentDate = new Date();
  currentView: 'daily' | 'weekly' | 'monthly' = 'daily';

  isPresent = false;
  isPunchedOut = false;
  punchInTime = '';
  punchOutTime = '';
  activeEntryId: number | null = null; // stores the DB id of today's open time entry
  punchInISOTime: string = ''; // stores actual ISO datetime of punch-in

  projects = [
    'Project Phoenix (UI Redesign)',
    'Nexus Migration',
    'Core API Optimization',
    'Internal Tools'
  ];

  leaveTypes = [
    { label: 'Casual Leave', value: 'casual' },
    { label: 'Sick Leave', value: 'sick' },
    { label: 'Earned Leave', value: 'earned' },
    { label: 'Comp-Off', value: 'compoff' }
  ];

  selectedLeaveType = '';
  leaveDescription = '';
  isLeaveSubmitted = false;

  // Daily Report Fields
  currentProject = '';
  workLocation = 'office';
  shiftType = 'morning';
  yesterdayWork = '';
  todayPlan = '';
  blockers = '';
  isReportSaving = false;

  leaveBalances: LeaveBalance[] = [];
  historyLogs: any[] = [];

  // Pagination
  pageSize = 5;
  currentPage = 1;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.historyLogs.length / this.pageSize));
  }

  get pagedLogs(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.historyLogs.slice(start, start + this.pageSize);
  }

  get showingFrom(): number {
    if (this.historyLogs.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.historyLogs.length);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  loadLeaveBalances() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.leaveService.getLeavesForUser(user.id).subscribe(leaves => {
        this.leaveBalances = leaves;
      });
    }
  }

  loadHistory() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.timeEntryService.getEntriesByUser(user.id).subscribe({
        next: (entries) => {
          // Restore today's attendance state from any open (no endTime) entry
          const today = new Date().toDateString();
          const todayOpenEntry = entries.find(e =>
            !e.endTime &&
            new Date(e.startTime).toDateString() === today
          );

          if (todayOpenEntry && todayOpenEntry.id) {
            this.isPresent = true;
            this.isPunchedOut = false;
            this.activeEntryId = todayOpenEntry.id;
            this.punchInISOTime = todayOpenEntry.startTime;
            this.punchInTime = new Date(todayOpenEntry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }

          // Check for a completed entry today (fully punched out)
          const todayClosedEntry = entries.find(e =>
            e.endTime &&
            new Date(e.startTime).toDateString() === today
          );
          if (todayClosedEntry) {
            this.isPresent = true;
            this.isPunchedOut = true;
            this.punchInTime = new Date(todayClosedEntry.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            this.punchOutTime = new Date(todayClosedEntry.endTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }

          this.historyLogs = entries.map(e => ({
            date: new Date(e.startTime).toLocaleDateString('default', { day:'2-digit', month:'short', year:'numeric' }),
            project: e.project,
            status: e.status,
            punchIn: new Date(e.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            punchOut: e.endTime ? new Date(e.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
            showDetails: false
          }));
        }
      });
    }
  }

  loadDailyReport() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.dailyReportService.getReport(user.id).subscribe({
        next: (report) => {
          if (report) {
            this.workLocation = report.workLocation;
            this.shiftType = report.shiftType;
            this.yesterdayWork = report.yesterdayWork;
            this.todayPlan = report.todayPlan;
            this.blockers = report.blockers;
          }
        }
      });
    }
  }

  saveDailyReport() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.isReportSaving = true;
      const report: DailyReport = {
        userId: user.id,
        user: { id: user.id },
        workLocation: this.workLocation,
        shiftType: this.shiftType,
        yesterdayWork: this.yesterdayWork,
        todayPlan: this.todayPlan,
        blockers: this.blockers
      };

      this.dailyReportService.saveReport(report).subscribe({
        next: () => {
          this.isReportSaving = false;
          alert('Daily report saved successfully!');
        },
        error: () => {
          this.isReportSaving = false;
        }
      });
    }
  }

  toggleDetails(log: any) {
    log.showDetails = !log.showDetails;
  }

  calculateDuration(punchIn: string, punchOut: string): string {
    if (punchIn === '-' || punchOut === '-') return '-';

    const parseTime = (timeStr: string) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    const inMinutes = parseTime(punchIn);
    const outMinutes = parseTime(punchOut);
    let diff = outMinutes - inMinutes;

    if (diff < 0) diff += 24 * 60; // Handle overnight shifts if any

    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h}h ${m}m`;
  }

  setView(view: 'daily' | 'weekly' | 'monthly') {
    this.currentView = view;
  }

  markPresent() {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id) return;

    const now = new Date();
    this.punchInISOTime = now.toISOString();

    const entry: TimeEntry = {
      userId: user.id,
      project: this.currentProject || 'General',
      description: 'Punch In',
      startTime: this.punchInISOTime,
      status: 'PRESENT'
    };

    this.timeEntryService.createEntry(entry).subscribe({
      next: (savedEntry) => {
        this.isPresent = true;
        this.activeEntryId = savedEntry.id!;
        this.punchInTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      },
      error: (err) => console.error('Punch in failed:', err)
    });
  }

  punchOut() {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id || !this.activeEntryId) return;

    const now = new Date();
    this.punchOutTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedEntry: TimeEntry = {
      userId: user.id,
      project: this.currentProject || 'General',
      description: 'Punch Out',
      startTime: this.punchInISOTime,
      endTime: now.toISOString(),
      status: 'PRESENT'
    };

    this.timeEntryService.updateEntry(this.activeEntryId, updatedEntry).subscribe({
      next: () => {
        this.isPunchedOut = true;
        this.activeEntryId = null;
        this.loadHistory();
      },
      error: (err) => console.error('Punch out failed:', err)
    });
  }

  submitLeaveRequest() {
    if (this.selectedLeaveType && this.leaveDescription) {
      this.isLeaveSubmitted = true;

      const user = this.authService.getCurrentUser();
      if (user && user.id) {
        const request: LeaveRequest = {
          userId: user.id,
          user: { id: user.id },
          type: this.selectedLeaveType,
          description: this.leaveDescription,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          status: 'PENDING'
        };

        this.leaveRequestService.createRequest(request).subscribe(() => {
          // Reset form after submission
          setTimeout(() => {
            this.selectedLeaveType = '';
            this.leaveDescription = '';
            this.isLeaveSubmitted = false;
          }, 3000);
        });
      }
    }
  }
}
