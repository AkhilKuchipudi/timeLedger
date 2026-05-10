import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  currentUser: any;
 
  constructor(private seoService: SeoService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
    this.seoService.updateTitle('My Profile');
    this.seoService.updateMetaTags(
      'Manage your account settings, profile information, and preferences on TimeLedger.',
      'profile settings, account management, user profile, timeledger settings'
    );
  }
}
