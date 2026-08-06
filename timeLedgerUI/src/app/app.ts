import { Component, signal, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SeoService } from './services/seo.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('TimeLedger');
  showSidebar = true;

  constructor(
    private seoService: SeoService,
    private router: Router
  ) { }

  ngOnInit() {
    // Global Theme Initialization on landing
    const savedTheme = localStorage.getItem('theme') || 'system';
    this.applyGlobalTheme(savedTheme as any);

    this.seoService.updateTitle('Home');
    this.seoService.updateMetaTags(
      'Efficiently track time, manage projects, and streamline your workflow with TimeLedger. The ultimate tool for productivity and financial clarity.',
      'time tracking, project management, ledger, productivity tool, business management'
    );

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url || '';
      const publicRoutes = ['/login', '/register'];
      const isPublic = publicRoutes.some(route => url.startsWith(route));

      const validRoutes = [
        '/',
        '/dashboard',
        '/login',
        '/register',
        '/timesheets',
        '/tasks',
        '/teams',
        '/settings',
        '/notifications',
        '/profile',
        '/admin/logs',
        '/reports',
        '/approvals'
      ];

      const isValid = validRoutes.some(r => {
        if (r === '/') return url === '/' || url === '';
        return url.startsWith(r);
      });

      this.showSidebar = isValid && !isPublic;
    });
  }

  applyGlobalTheme(theme: 'light' | 'dark' | 'system') {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme', 'dim-theme');
    if (theme === 'light') body.classList.add('light-theme');
    if (theme === 'dark') body.classList.add('dark-theme');

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        body.classList.add('dark-theme');
      } else {
        body.classList.add('light-theme');
      }
    }
  }
}
