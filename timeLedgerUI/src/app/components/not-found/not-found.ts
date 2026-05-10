import { Component } from '@angular/core';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: false,
  template: `
    <div class="not-found-container">
      <div class="glass-panel">
        <span class="material-symbols-rounded icon">error</span>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <a routerLink="/dashboard" class="home-btn">Return to Dashboard</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      padding: 2rem;
    }
    .glass-panel {
      background: var(--glass-background);
      backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border);
      border-radius: var(--glass-radius);
      padding: 4rem;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .icon {
      font-size: 5rem;
      color: var(--tertiary);
      margin-bottom: 1.5rem;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: var(--onSurface);
    }
    p {
      color: var(--onSurfaceVariant);
      margin-bottom: 2rem;
    }
    .home-btn {
      display: inline-block;
      background: var(--primary);
      color: white;
      padding: 1rem 2rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      transition: transform 0.2s;
    }
    .home-btn:hover {
      transform: translateY(-2px);
    }
  `]
})
export class NotFoundComponent {
  constructor(private seoService: SeoService) {
    this.seoService.updateTitle('404 Not Found');
    this.seoService.updateMetaTags('The page you requested was not found on TimeLedger.');
  }
}
