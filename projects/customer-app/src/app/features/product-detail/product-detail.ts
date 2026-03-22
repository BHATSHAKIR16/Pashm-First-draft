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
import { LangLinkPipe } from '../../core/pipes/lang-link.pipe';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, LangLinkPipe, TranslocoModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
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
