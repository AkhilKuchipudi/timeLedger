import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private titleService: Title, private metaService: Meta) { }

  updateTitle(title: string) {
    this.titleService.setTitle(`${title} | TimeLedger`);
  }

  updateMetaTags(description: string, keywords: string = '') {
    this.metaService.updateTag({ name: 'description', content: description });
    if (keywords) {
      this.metaService.updateTag({ name: 'keywords', content: keywords });
    }
    
    // Update OG tags too
    this.metaService.updateTag({ property: 'og:title', content: this.titleService.getTitle() });
    this.metaService.updateTag({ property: 'og:description', content: description });
  }
}
