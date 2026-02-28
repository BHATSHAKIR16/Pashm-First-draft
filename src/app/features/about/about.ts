import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { SeoService } from '../../core/services/seo';

interface Pillar {
  icon: string;
  title: string;
  body: string;
}

interface Stage {
  num: string;
  seed: string;
  alt: string;
  title: string;
  body: string;
  offset: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutComponent {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.updateTitle('Our Legacy of Softness — Al-Masrah Heritage');
    this.seo.updateMetaTags([
      { name: 'description', content: 'Since 1982, Al-Masrah has been weaving stories of heritage and elegance. Discover the four stages of softness and the artisans behind every piece.' },
    ]);
  }

  readonly pillars: Pillar[] = [
    {
      icon: 'eco',
      title: 'Ethical Sourcing',
      body: 'Honoring nature through cruelty-free harvesting in harmony with seasonal cycles.',
    },
    {
      icon: 'auto_awesome',
      title: 'Authentic Craft',
      body: 'Preserving ancestral techniques that require months of patient, rhythmic dedication.',
    },
    {
      icon: 'temple_hindu',
      title: 'Artisan Legacy',
      body: 'Empowering communities and sustaining the cultural fabric of master weaving families.',
    },
  ];

  readonly stages: Stage[] = [
    {
      num: '01',
      seed: 'assets/Pashmina-Goat-Combing.webp',
      alt: 'Cleaning and sorting raw pashmina fibers',
      title: 'Cleaning & Sorting',
      body: "The finest 'Pashm' is selected by hand, ensuring only the cloud-like undercoat remains for production.",
      offset: '',
    },
    {
      num: '02',
      seed: 'assets/spinning.jpeg',
      alt: 'Traditional wooden spinning wheel',
      title: 'Artisanal Spinning',
      body: 'Traditional wooden wheels transform raw fiber into delicate, translucent threads with meditative precision.',
      offset: 'lg:mt-12',
    },
    {
      num: '03',
      seed: 'assets/weaving-5.webp',
      alt: 'Ancient handloom weaving fabric',
      title: 'Hand Weaving',
      body: 'On ancient handlooms, threads are intertwined into a breathable, ethereal fabric that feels like a second skin.',
      offset: 'lg:mt-6',
    },
    {
      num: '04',
      seed: 'assets/Pashmina-stitching-new.webp',
      alt: 'Detailed hand embroidery and finishing',
      title: 'Finishing Touches',
      body: 'Hand-embroidery and soft washing bring the final piece to life, ensuring it meets our standard of ethereal softness.',
      offset: 'lg:mt-16',
    },
  ];
}
