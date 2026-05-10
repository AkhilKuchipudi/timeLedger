import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  registerData = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    accountType: 'INDIVIDUAL'
  };
  isLoading = false;

  constructor(
    private seoService: SeoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.seoService.updateTitle('Create Account');
    this.seoService.updateMetaTags(
      'Join TimeLedger today to start tracking your time and improving your productivity.',
      'register, sign up, timeledger account, productivity'
    );
  }

  onSubmit() {
    if (!this.registerData.fullName || !this.registerData.username || !this.registerData.email || !this.registerData.password) {
      alert('Please fill in all fields');
      return;
    }

    this.isLoading = true;
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        alert('Account created successfully! Please log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert(err.error?.message || 'Registration failed. Please try again.');
        this.isLoading = false;
      }
    });
  }
}
