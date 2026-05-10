import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { NotificationService, Notification as BackendNotification } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: Date;
  type: 'info' | 'success' | 'warning' | 'error' | 'task';
  read: boolean;
  category: string;
}

@Component({
  selector: 'app-notifications',
  standalone: false,
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications implements OnInit {
  notifications: Notification[] = [];
  isLoading = true;

  constructor(
    private seoService: SeoService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.seoService.updateTitle('Notifications');
    this.seoService.updateMetaTags(
      'Stay updated with your latest project tasks, system alerts, and timesheet approvals on TimeLedger.',
      'notifications, alerts, task updates, project alerts'
    );
    this.loadNotifications();
  }

  loadNotifications() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.isLoading = true;
      this.notificationService.getNotificationsForUser(user.id).subscribe({
        next: (data) => {
          this.notifications = data.map(n => ({
            id: n.id.toString(),
            title: n.title,
            message: n.message,
            time: new Date(n.time),
            type: n.type,
            read: n.read,
            category: n.category
          }));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading notifications', err);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  get unreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notificationService.markAsRead(Number(id)).subscribe();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => {
      if (!n.read) {
        n.read = true;
        this.notificationService.markAsRead(Number(n.id)).subscribe();
      }
    });
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notificationService.deleteNotification(Number(id)).subscribe();
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'task': return 'assignment';
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'notifications';
    }
  }
}
