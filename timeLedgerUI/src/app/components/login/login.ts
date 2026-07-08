import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  credentials = { username: '', password: '', accountType: 'INDIVIDUAL' };
  error = '';
  showPassword = false;
  keepMeLoggedIn = false;

  constructor(
    private seoService: SeoService,
    private authService: AuthService,
    private router: Router
  ) {}


  ngOnInit() {
    this.seoService.updateTitle('Login');
    this.seoService.updateMetaTags(
      'Sign in to TimeLedger to track your time, manage projects, and view your productivity reports.',
      'login, timeledger sign in, project management login'
    );
  }

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || err.error || 'Invalid username or password';
      }
    });
  }
}

