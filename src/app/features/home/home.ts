import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo';

@Component({
  selector: 'app-home',
  imports: [MatIconModule, RouterLink],
  template: `
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <img
        src="https://picsum.photos/seed/hero/1920/1080"
        alt="Hero Background"
        class="absolute inset-0 w-full h-full object-cover opacity-20"
        referrerPolicy="no-referrer"
      />
      <div class="relative z-10 text-center px-4 max-w-4xl">
        <p class="text-[10px] uppercase tracking-[0.4em] text-brand-gold mb-8 animate-fade-in">Established 1984</p>
        <h1 class="text-6xl md:text-8xl font-serif italic mb-12 leading-tight">
          Textural Overlay <span class="text-brand-gold">&</span> Design Variant
        </h1>
        <p class="text-sm md:text-base text-brand-charcoal/70 mb-12 font-sans leading-relaxed tracking-wide max-w-2xl mx-auto">
          A refined evolution focusing on sharp premium minimalism, replacing organic green tones with warm textural surfaces and precise geometric framing.
        </p>
        
        <div class="flex flex-wrap justify-center gap-6">
          <button routerLink="/collection" class="btn-primary">The Collection</button>
          <button class="btn-outline">Our Heritage</button>
        </div>
      </div>
    </section>

    <section class="py-32 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div class="group">
            <div class="aspect-[3/4] overflow-hidden mb-8 product-frame">
              <img src="https://picsum.photos/seed/everyday/600/800" alt="Everyday Essentials" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
            </div>
            <h3 class="text-2xl font-serif mb-2">Everyday Essentials</h3>
            <p class="text-xs text-brand-gold uppercase tracking-widest">Dubai, UAE</p>
          </div>
          <div class="group">
            <div class="aspect-[3/4] overflow-hidden mb-8 product-frame">
              <img src="https://picsum.photos/seed/signature/600/801" alt="Signature Weaves" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
            </div>
            <h3 class="text-2xl font-serif mb-2">Signature Weaves</h3>
            <p class="text-xs text-brand-gold uppercase tracking-widest">Riyadh, KSA</p>
          </div>
          <div class="group">
            <div class="aspect-[3/4] overflow-hidden mb-8 product-frame">
              <img src="https://picsum.photos/seed/limited/600/802" alt="Limited Editions" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
            </div>
            <h3 class="text-2xl font-serif mb-2">Limited Editions</h3>
            <p class="text-xs text-brand-gold uppercase tracking-widest">Abu Dhabi, UAE</p>
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.updateTitle('Premium Pashmina Craftsmanship');
    this.seo.updateMetaTags([
      { name: 'description', content: 'AL-MASRAH: Redefining luxury pashmina for the modern connoisseur.' }
    ]);
  }
}
