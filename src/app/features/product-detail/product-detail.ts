import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../core/services/product';
import { CartService } from '../../core/services/cart';
import { SeoService } from '../../core/services/seo';
import { Product } from '../../core/models/product';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap, map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      @if (isLoading()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div class="aspect-[3/4] bg-brand-sand/50 product-frame"></div>
          <div class="space-y-6">
            <div class="h-10 bg-brand-sand/50 w-3/4"></div>
            <div class="h-6 bg-brand-sand/50 w-1/4"></div>
            <div class="h-24 bg-brand-sand/50 w-full"></div>
            <div class="h-12 bg-brand-sand/50 w-full"></div>
          </div>
        </div>
      } @else if (product(); as p) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <!-- Left: Image Gallery -->
          <div class="space-y-6">
            <div class="aspect-[3/4] overflow-hidden product-frame relative group">
              <img 
                [src]="activeImage()" 
                [alt]="p.name" 
                class="w-full h-full object-cover transition-opacity duration-500"
                [class.opacity-0]="isImageChanging()"
                referrerPolicy="no-referrer"
              />
              <button class="absolute bottom-6 left-6 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <mat-icon class="text-sm">fullscreen</mat-icon>
              </button>
            </div>
            
            <div class="grid grid-cols-4 gap-4">
              @for (img of p.images; track img) {
                <button 
                  (click)="setActiveImage(img)"
                  class="aspect-square overflow-hidden product-frame border-2 transition-all duration-300"
                  [class.border-brand-gold]="activeImage() === img"
                  [class.border-transparent]="activeImage() !== img"
                >
                  <img [src]="img" [alt]="p.name" class="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              }
            </div>
          </div>

          <!-- Right: Product Info -->
          <div class="flex flex-col">
            <nav class="flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand-charcoal/40 mb-8">
              <a routerLink="/" class="hover:text-brand-gold transition-colors">Home</a>
              <mat-icon class="text-[10px]">chevron_right</mat-icon>
              <a routerLink="/collection" class="hover:text-brand-gold transition-colors">Collection</a>
              <mat-icon class="text-[10px]">chevron_right</mat-icon>
              <span class="text-brand-charcoal">{{ p.name }}</span>
            </nav>

            <h1 class="text-5xl md:text-6xl font-serif mb-4 leading-tight">{{ p.name }}</h1>
            <p class="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-8">100% Handwoven Pashm</p>
            
            <div class="flex items-center gap-6 mb-12">
              <span class="text-2xl font-serif">{{ p.price | number }} {{ p.currency }}</span>
              <div class="h-4 w-px bg-brand-charcoal/10"></div>
              <div class="flex items-center gap-2">
                <div class="flex text-brand-gold">
                  @for (star of [1,2,3,4,5]; track star) {
                    <mat-icon class="text-sm">star</mat-icon>
                  }
                </div>
                <span class="text-[10px] uppercase tracking-widest text-brand-charcoal/40">(24 Reviews)</span>
              </div>
            </div>

            <p class="text-brand-charcoal/70 leading-relaxed mb-12 max-w-lg">
              {{ p.description }}
            </p>

            <!-- Color Swatches -->
            <div class="mb-12">
              <p class="text-[10px] uppercase tracking-widest font-bold mb-4">Color: <span class="text-brand-charcoal/60 font-normal">{{ selectedColor() }}</span></p>
              <div class="flex gap-4">
                @for (color of p.colors; track color) {
                  <button 
                    (click)="selectedColor.set(color)"
                    class="w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110"
                    [class.border-brand-gold]="selectedColor() === color"
                    [class.border-transparent]="selectedColor() !== color"
                    [style.backgroundColor]="getColorHex(color)"
                    [title]="color"
                  ></button>
                }
              </div>
            </div>

            <div class="space-y-4 mb-12">
              <button (click)="addToCart(p)" class="w-full btn-gold py-4 flex items-center justify-center gap-4">
                Add to Bag <mat-icon class="text-sm">arrow_forward</mat-icon>
              </button>
              <button class="w-full btn-outline py-4">Inquire for Wholesale</button>
            </div>

            <div class="grid grid-cols-2 gap-8 pt-12 border-t border-brand-charcoal/5">
              <div class="flex items-center gap-4">
                <mat-icon class="text-brand-gold text-lg">local_shipping</mat-icon>
                <span class="text-[8px] uppercase tracking-widest text-brand-charcoal/60">Complimentary Global Shipping</span>
              </div>
              <div class="flex items-center gap-4">
                <mat-icon class="text-brand-gold text-lg">verified_user</mat-icon>
                <span class="text-[8px] uppercase tracking-widest text-brand-charcoal/60">Certificate of Authenticity</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Heritage Details -->
        <section class="py-16 bg-brand-sand/30 bg-subtle-pattern border-y border-brand-gold/10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
              <p class="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">Distinguishing Features</p>
              <h2 class="text-4xl md:text-5xl font-serif italic">Heritage Details</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div class="text-center space-y-4">
                <div class="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <mat-icon class="text-brand-pearl text-xl">air</mat-icon>
                </div>
                <h4 class="text-lg font-serif">Ethereal Lightness</h4>
                <p class="text-xs text-brand-charcoal/60 leading-relaxed">Remarkably weightless yet exceptionally warm, a testament to the fine micron count of pure hand-spun pashm.</p>
              </div>
              <div class="text-center space-y-4">
                <div class="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <mat-icon class="text-brand-pearl text-xl">auto_fix_high</mat-icon>
                </div>
                <h4 class="text-lg font-serif">Hand-Embroidered Borders</h4>
                <p class="text-xs text-brand-charcoal/60 leading-relaxed">Intricate needlework using traditional Sozni techniques, reflecting centuries of nomadic artistry and storytelling.</p>
              </div>
              <div class="text-center space-y-4">
                <div class="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <mat-icon class="text-brand-pearl text-xl">flare</mat-icon>
                </div>
                <h4 class="text-lg font-serif">Rare Cashmere Fibers</h4>
                <p class="text-xs text-brand-charcoal/60 leading-relaxed">Sourced exclusively from the softest underfleece of the Changthangi goat, harvested only once a year.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Care Ritual -->
        <section class="py-20 bg-brand-sand/10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div class="aspect-[3/4] product-frame overflow-hidden">
              <img src="https://picsum.photos/seed/craft/800/1000" alt="Preservation Artistry" class="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div class="space-y-12">
              <div>
                <p class="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-4">Preservation Artistry</p>
                <h2 class="text-4xl md:text-5xl font-serif italic mb-8">The Care Ritual</h2>
              </div>
              
              <div class="space-y-8">
                <div class="flex gap-8">
                  <span class="text-2xl font-serif italic text-brand-gold/40">01</span>
                  <div>
                    <h4 class="text-[10px] uppercase tracking-widest font-bold mb-2">Gentle Hand Wash</h4>
                    <p class="text-xs text-brand-charcoal/60 leading-relaxed">Cleanse sparingly using tepid water and mild silk-specialized detergent. Avoid rubbing to preserve the delicate structure of the fibers.</p>
                  </div>
                </div>
                <div class="flex gap-8">
                  <span class="text-2xl font-serif italic text-brand-gold/40">02</span>
                  <div>
                    <h4 class="text-[10px] uppercase tracking-widest font-bold mb-2">Natural Air Dry</h4>
                    <p class="text-xs text-brand-charcoal/60 leading-relaxed">Lay flat on a clean, light-colored towel away from direct sunlight. Reshape gently while damp to maintain its original proportions.</p>
                  </div>
                </div>
                <div class="flex gap-8">
                  <span class="text-2xl font-serif italic text-brand-gold/40">03</span>
                  <div>
                    <h4 class="text-[10px] uppercase tracking-widest font-bold mb-2">Breathable Storage</h4>
                    <p class="text-xs text-brand-charcoal/60 leading-relaxed">Store in a cool, dry place within its signature Al-Masrah muslin bag. Avoid hanging to prevent fiber stretching over time.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      } @else {
        <div class="text-center py-32">
          <h2 class="text-3xl font-serif mb-8">Product not found</h2>
          <button routerLink="/collection" class="btn-primary">Back to Collection</button>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private seo = inject(SeoService);
  private document = inject(DOCUMENT);

  isLoading = signal(true);
  isImageChanging = signal(false);
  activeImage = signal('');
  selectedColor = signal('');

  product = toSignal(
    this.route.params.pipe(
      map(params => params['slug']),
      tap(() => this.isLoading.set(true)),
      switchMap(slug => this.productService.getProductBySlug(slug)),
      tap(p => {
        if (p) {
          this.activeImage.set(p.images[0]);
          this.selectedColor.set(p.colors[0]);
          this.updateSeo(p);
          this.addStructuredData(p);
        }
        this.isLoading.set(false);
      })
    )
  );

  setActiveImage(img: string) {
    if (this.activeImage() === img) return;
    this.isImageChanging.set(true);
    setTimeout(() => {
      this.activeImage.set(img);
      this.isImageChanging.set(false);
    }, 300);
  }

  getColorHex(color: string): string {
    const colors: Record<string, string> = {
      'Midnight Blue': '#191970',
      'Amber': '#FFBF00',
      'Ivory': '#FFFFF0',
      'Saffron': '#F4C430',
      'Emerald': '#50C878',
      'Rose': '#FF007F',
      'Black': '#000000',
      'Gold': '#D4AF37',
      'Desert Sand': '#EDC9AF'
    };
    return colors[color] || '#cccccc';
  }

  addToCart(product: Product) {
    this.cartService.addItem(product);
  }

  private updateSeo(p: Product) {
    this.seo.updateTitle(`${p.name} | AL-MASRAH`);
    this.seo.updateMetaTags([
      { name: 'description', content: p.description },
      { property: 'og:title', content: p.name },
      { property: 'og:description', content: p.description },
      { property: 'og:image', content: p.images[0] },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]);
  }

  private addStructuredData(p: Product) {
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    const jsonLd = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      'name': p.name,
      'image': p.images,
      'description': p.description,
      'sku': p.id,
      'brand': {
        '@type': 'Brand',
        'name': 'AL-MASRAH'
      },
      'offers': {
        '@type': 'Offer',
        'url': this.document.location.href,
        'priceCurrency': p.currency,
        'price': p.price,
        'availability': 'https://schema.org/InStock'
      }
    };
    script.text = JSON.stringify(jsonLd);
    this.document.head.appendChild(script);
  }
}
