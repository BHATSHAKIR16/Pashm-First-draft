import { Injectable, inject } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);

  updateTitle(newTitle: string) {
    this.title.setTitle(`${newTitle} | AL-MASRAH`);
  }

  updateMetaTags(tags: MetaDefinition[]) {
    tags.forEach(tag => this.meta.updateTag(tag));
  }

  setCanonicalURL(url?: string) {
    const canURL = url === undefined ? window.location.href : url;
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (link) {
      link.setAttribute('href', canURL);
    } else {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canURL);
      document.head.appendChild(link);
    }
  }
}
