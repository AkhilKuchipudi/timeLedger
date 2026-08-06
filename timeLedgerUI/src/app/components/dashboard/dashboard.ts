import { Component, OnInit, signal, computed } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { TaskService, Task } from '../../services/task.service';
import { TimeEntryService, TimeEntry } from '../../services/time-entry.service';
import { AuthService } from '../../services/auth.service';
import { ManagerService } from '../../services/manager.service';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  activeCount = signal(0);
  pendingCount = signal(0);
  completedCount = signal(0);
  totalHours = signal(0);
  consistencyScore = signal(0);
  pendingApprovalsCount = signal(0);

  allocationStats = signal<any>({ LOW: 0, MEDIUM: 0, HIGH: 0 });
  allocationPercentages = signal<any>({ LOW: 0, MEDIUM: 0, HIGH: 0 });

  tasks = signal<Task[]>([]);
  projects = signal<any[]>([]);
  recentActivities = signal<any[]>([]);
  isLoading = signal(true);
  currentUser: any;
  teamSize = 0;

  public lineChartData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        label: 'Tasks Completed',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1',
        fill: 'origin',
        tension: 0.4
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 20, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } }
      }
    }
  };

  constructor(
    private seoService: SeoService,
    private taskService: TaskService,
    private timeEntryService: TimeEntryService,
    private authService: AuthService,
    private managerService: ManagerService
  ) {}
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.loadDashboardData();
    });
  }

  loadDashboardData() {
    this.isLoading.set(true);
    const user = this.authService.getCurrentUser();

    if (user && user.id) {
      // Load Task Stats
      this.taskService.getTaskStats(user.id).subscribe({
        next: (stats: any) => {
          this.activeCount.set(stats.IN_PROGRESS || 0);
          this.pendingCount.set(stats.TODO || 0);
          this.completedCount.set(stats.DONE || 0);

          if (stats.priorities) {
            this.allocationStats.set(stats.priorities);
            this.updateAllocationChart(stats.priorities);
          }
        }
      });

      // Load Productivity Stats
      this.taskService.getProductivityStats(user.id).subscribe({
        next: (data: number[]) => {
          this.lineChartData.datasets[0].data = data;
        }
      });

      // Load All Tasks for list
      this.taskService.getTasks().subscribe({
        next: (tasks: Task[]) => {
          this.tasks.set(tasks);
          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error('Error loading tasks', err);
          this.isLoading.set(false);
        }
      });

      // Load Time Entries for activity feed
      this.timeEntryService.getEntriesByUser(user.id).subscribe({
        next: (entries: TimeEntry[]) => {
          const totalMins = entries.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
          this.totalHours.set(Math.round(totalMins / 60));

          // Extract unique projects
          const uniqueProjects = [...new Set(entries.map(e => e.project))];
          this.projects.set(uniqueProjects.map(p => ({
            name: p,
            status: 'Active',
            percentage: Math.floor(Math.random() * 40) + 60 // Placeholder percentage
          })));

          const activities = entries.slice(0, 5).map((e: TimeEntry) => ({
            actorName: user.fullName || user.username,
            timeAgo: this.getTimeAgo(new Date(e.startTime)),
            activityDesc: `Logged ${e.project}: ${e.description}`,
            type: e.status === 'PRESENT' ? 'primary' : 'tertiary'
          }));
          this.recentActivities.set(activities);
        }
      });

      // Load Consistency Score
      this.timeEntryService.getConsistencyScore(user.id).subscribe({
        next: (score: number) => {
          this.consistencyScore.set(Math.round(score));
        }
      });

      // Load Pending Approvals for PM/Admin
      if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_PM') {
        this.managerService.getPendingRequests().subscribe({
          next: (data) => {
            this.pendingApprovalsCount.set(data.leaves.length + data.timesheets.length);
          }
        });
      }
    } else {
      this.isLoading.set(false);
    }
  }

  getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  }

  updateAllocationChart(priorities: any) {
    const total = (priorities.LOW || 0) + (priorities.MEDIUM || 0) + (priorities.HIGH || 0) || 1;
    const lowP = Math.round(((priorities.LOW || 0) / total) * 100);
    const medP = Math.round(((priorities.MEDIUM || 0) / total) * 100);
    const highP = 100 - lowP - medP;
    
    this.allocationPercentages.set({ LOW: lowP, MEDIUM: medP, HIGH: highP });
  }

  getDashArray(type: 'HIGH' | 'MEDIUM' | 'LOW'): string {
    const p = this.allocationPercentages()[type] || 0;
    const length = (p / 100) * 502;
    return `${length} 502`;
  }

  getDashOffset(type: 'HIGH' | 'MEDIUM' | 'LOW'): string {
    let offset = 0;
    const p = this.allocationPercentages();
    if (type === 'HIGH') {
      offset = 0;
    } else if (type === 'MEDIUM') {
      offset = -((p.HIGH || 0) / 100) * 502;
    } else if (type === 'LOW') {
      offset = -(((p.HIGH || 0) + (p.MEDIUM || 0)) / 100) * 502;
    }
    return `${offset}`;
  }
}
