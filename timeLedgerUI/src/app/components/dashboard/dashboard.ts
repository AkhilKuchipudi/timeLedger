import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { TaskService, Task } from '../../services/task.service';
import { TimeEntryService, TimeEntry } from '../../services/time-entry.service';
import { AuthService } from '../../services/auth.service';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  activeCount = 0;
  pendingCount = 0;
  completedCount = 0;
  totalHours = 0;
  
  tasks: Task[] = [];
  recentActivities: any[] = [];
  isLoading = true;
  currentUser: any;

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
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.loadDashboardData();
    });
  }

  loadDashboardData() {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();
    
    if (user && user.id) {
      // Load Task Stats
      this.taskService.getTaskStats().subscribe({
        next: (stats: any) => {
          this.activeCount = stats.IN_PROGRESS || 0;
          this.pendingCount = stats.TODO || 0;
          this.completedCount = stats.DONE || 0;
          
          this.lineChartData.datasets[0].data = [2, 5, 3, 8, 4, 6, this.completedCount];
        }
      });

      // Load All Tasks for list
      this.taskService.getTasks().subscribe({
        next: (tasks: Task[]) => {
          this.tasks = tasks;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error loading tasks', err);
          this.isLoading = false;
        }
      });

      // Load Time Entries for activity feed
      this.timeEntryService.getEntriesByUser(user.id).subscribe({
        next: (entries: TimeEntry[]) => {
          this.recentActivities = entries.slice(0, 5).map((e: TimeEntry) => ({
            actorName: user.fullName || user.username,
            timeAgo: this.getTimeAgo(new Date(e.startTime)),
            activityDesc: `Logged ${e.project}: ${e.description}`,
            type: e.status === 'PRESENT' ? 'primary' : 'tertiary'
          }));
        }
      });
    } else {
      this.isLoading = false;
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
}
