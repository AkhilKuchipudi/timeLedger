import { Component, signal, OnInit } from '@angular/core';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('TimeLedger');

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateTitle('Home');
    this.seoService.updateMetaTags(
      'Efficiently track time, manage projects, and streamline your workflow with TimeLedger. The ultimate tool for productivity and financial clarity.',
      'time tracking, project management, ledger, productivity tool, business management'
    );
  }
}
