import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;
  unreadNotificationsCount = 0;
  
  isMobileMenuOpen = false;
  isSignOutModalOpen = false;
  currentTheme: 'light' | 'dark' | 'system' = 'system';
  previousThemeOption: string = '';

  constructor(
    private el: ElementRef, 
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.currentTheme = (localStorage.getItem('theme') as any) || 'system';
    this.previousThemeOption = this.getOptionNum(this.currentTheme);
    this.applyTheme(this.currentTheme);

    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      if (user && user.id) {
        this.loadUnreadCount(user.id);
      }
    });
  }

  loadUnreadCount(userId: number) {
    this.notificationService.getNotificationsForUser(userId).subscribe(notifications => {
      this.unreadNotificationsCount = notifications.filter(n => !n.read).length;
    });
  }

  openSignOutModal(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isSignOutModalOpen = true;
  }

  goToProfile(event: Event) {
    this.handleLinkClick();
    this.router.navigate(['/profile']);
  }

  closeSignOutModal() {
    this.isSignOutModalOpen = false;
  }

  confirmSignOut() {
    this.authService.logout();
    this.closeSignOutModal();
    this.router.navigate(['/login']);
  }

  setTheme(theme: 'light' | 'dark' | 'system') {
    this.previousThemeOption = this.getOptionNum(this.currentTheme);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  getOptionNum(theme: string): string {
    if (theme === 'light') return '1';
    if (theme === 'dark') return '2';
    if (theme === 'system') return '3';
    return '1';
  }

  applyTheme(theme: 'light' | 'dark' | 'system') {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme', 'dim-theme');
    if (theme === 'light') body.classList.add('light-theme');
    if (theme === 'dark') body.classList.add('dark-theme');
  }

  isDragging = false;
  dragged = false;
  dragStartY = 0;
  mobileToggleTop = 50; // percentage

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.handleDrag(event.clientY);
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.isDragging = false;
    setTimeout(() => (this.dragged = false), 50);
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.isDragging) {
      this.handleDrag(event.touches[0].clientY);
    }
  }

  @HostListener('window:touchend')
  onTouchEnd() {
    this.isDragging = false;
    setTimeout(() => (this.dragged = false), 50);
  }

  onDragStart(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.dragged = false;
    this.dragStartY = (event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY;
  }

  handleDrag(clientY: number) {
    if (Math.abs(clientY - this.dragStartY) > 5) {
      this.dragged = true;
    }
    const height = window.innerHeight;
    let newTop = (clientY / height) * 100;
    this.mobileToggleTop = Math.max(5, Math.min(95, newTop));
  }

  toggleMobileMenu() {
    if (!this.dragged) {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  handleLinkClick() {
    this.closeMobileMenu();
  }
}
