import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { TimeEntryService, TimeEntry } from '../../services/time-entry.service';
import { AuthService } from '../../services/auth.service';
import { LeaveService, LeaveBalance } from '../../services/leave.service';

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
    private leaveService: LeaveService
  ) {}

  ngOnInit() {
    this.seoService.updateTitle('Timesheet');
    this.seoService.updateMetaTags(
      'Track your daily work hours, manage punch-in/out times, and view your work history with the TimeLedger Timesheet.',
      'timesheet, work hours, punch in, punch out, time tracking'
    );
    this.loadHistory();
    this.loadLeaveBalances();
  }

  currentDate = new Date();
  currentView: 'daily' | 'weekly' | 'monthly' = 'daily';
  
  isPresent = false;
  isPunchedOut = false;
  punchInTime = '';
  punchOutTime = '';
  
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

  leaveBalances: LeaveBalance[] = [];
  historyLogs: any[] = [];

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
    this.isPresent = true;
    const now = new Date();
    this.punchInTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // In a full implementation, we might save the "Punch In" to backend immediately
  }

  punchOut() {
    this.isPunchedOut = true;
    const now = new Date();
    this.punchOutTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      const entry: TimeEntry = {
        userId: user.id,
        project: 'Current Task Selection', // Placeholder
        description: 'Daily work log',
        startTime: new Date().toISOString(), // This should ideally be the punchInTime from earlier
        endTime: new Date().toISOString(),
        status: 'PRESENT'
      };

      this.timeEntryService.createEntry(entry).subscribe(() => {
        this.loadHistory();
      });
    }
  }

  submitLeaveRequest() {
    if (this.selectedLeaveType && this.leaveDescription) {
      this.isLeaveSubmitted = true;
      
      const user = this.authService.getCurrentUser();
      if (user && user.id) {
        const entry: TimeEntry = {
          userId: user.id,
          project: 'Leave Request: ' + this.selectedLeaveType,
          description: this.leaveDescription,
          startTime: new Date().toISOString(),
          status: 'LEAVE'
        };

        this.timeEntryService.createEntry(entry).subscribe(() => {
          this.loadHistory();
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
