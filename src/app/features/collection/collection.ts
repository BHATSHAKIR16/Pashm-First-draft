import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../core/services/product';
import { SeoService } from '../../core/services/seo';
import { ProductFilters } from '../../core/models/product';
import { ProductCardComponent } from '../../shared/components/product-card';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, MatIconModule, ProductCardComponent],
  template: `
    <section class="pt-24 pb-12 bg-brand-pearl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-4">Timeless Elegance</p>
        <h1 class="text-5xl md:text-7xl font-serif italic mb-12">The Collection</h1>
      </div>
    </section>

    <!-- Filters Bar -->
    <div class="bg-brand-pearl border-y border-brand-charcoal/5 py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-4">
        <div class="flex gap-8">
          <div class="relative group">
            <button class="text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-brand-gold transition-colors">
              Fabric <mat-icon class="text-xs">expand_more</mat-icon>
            </button>
            <div class="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl border border-brand-charcoal/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              @for (f of fabrics; track f) {
                <button 
                  (click)="updateFilter('fabric', f)"
                  class="w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-pearl transition-colors"
                  [class.text-brand-gold]="currentFilters().fabric === f"
                >
                  {{ f }}
                </button>
              }
              <button (click)="updateFilter('fabric', null)" class="w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-pearl text-red-400">Clear</button>
            </div>
          </div>

          <div class="relative group">
            <button class="text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-brand-gold transition-colors">
              Color <mat-icon class="text-xs">expand_more</mat-icon>
            </button>
            <div class="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl border border-brand-charcoal/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              @for (c of colors; track c) {
                <button 
                  (click)="updateFilter('color', c)"
                  class="w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-pearl transition-colors"
                  [class.text-brand-gold]="currentFilters().color === c"
                >
                  {{ c }}
                </button>
              }
              <button (click)="updateFilter('color', null)" class="w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-pearl text-red-400">Clear</button>
            </div>
          </div>

          <div class="relative group">
            <button class="text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-brand-gold transition-colors">
              Occasion <mat-icon class="text-xs">expand_more</mat-icon>
            </button>
            <div class="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl border border-brand-charcoal/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              @for (o of occasions; track o) {
                <button 
                  (click)="updateFilter('occasion', o)"
                  class="w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-pearl transition-colors"
                  [class.text-brand-gold]="currentFilters().occasion === o"
                >
                  {{ o }}
                </button>
              }
              <button (click)="updateFilter('occasion', null)" class="w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-pearl text-red-400">Clear</button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-8">
          <p class="text-[10px] uppercase tracking-widest text-brand-charcoal/40">
            Showing {{ products()?.length || 0 }} Products
          </p>
          <div class="relative group">
            <button class="text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-brand-gold transition-colors">
              Sort By <mat-icon class="text-xs">sort</mat-icon>
            </button>
            <div class="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl border border-brand-charcoal/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button (click)="updateFilter('sort', 'newest')" class="w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-pearl">Newest</button>
              <button (click)="updateFilter('sort', 'price_asc')" class="w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-pearl">Price: Low to High</button>
              <button (click)="updateFilter('sort', 'price_desc')" class="w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-brand-pearl">Price: High to Low</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      @if (isLoading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          @for (i of [1,2,3,4,5,6,7,8]; track i) {
            <div class="animate-pulse">
              <div class="aspect-[3/4] bg-brand-sand/50 mb-6"></div>
              <div class="h-4 bg-brand-sand/50 w-3/4 mx-auto mb-2"></div>
              <div class="h-3 bg-brand-sand/50 w-1/2 mx-auto"></div>
            </div>
          }
        </div>
      } @else if (error()) {
        <div class="text-center py-20">
          <mat-icon class="text-5xl text-red-400 mb-4">error_outline</mat-icon>
          <h2 class="text-2xl font-serif mb-4">Something went wrong</h2>
          <button (click)="retry()" class="btn-outline">Try Again</button>
        </div>
      } @else if (products()?.length === 0) {
        <div class="text-center py-20">
          <mat-icon class="text-5xl text-brand-gold/40 mb-4">search_off</mat-icon>
          <h2 class="text-2xl font-serif mb-4">No products found</h2>
          <p class="text-brand-charcoal/60 mb-8">Try adjusting your filters to find what you're looking for.</p>
          <button (click)="clearAllFilters()" class="btn-outline">Clear All Filters</button>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          @for (product of products(); track product.id) {
            <app-product-card [product]="product" />
          }
        </div>
      }

      <!-- Pagination Mockup -->
      <div class="mt-20 flex justify-center items-center gap-4">
        <button class="w-10 h-10 border border-brand-charcoal/10 flex items-center justify-center hover:border-brand-gold transition-colors">
          <mat-icon class="text-sm">chevron_left</mat-icon>
        </button>
        <span class="text-[10px] uppercase tracking-widest font-medium">Page 01 / 03</span>
        <button class="w-10 h-10 border border-brand-charcoal/10 flex items-center justify-center hover:border-brand-gold transition-colors">
          <mat-icon class="text-sm">chevron_right</mat-icon>
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent implements OnInit {
  private productService = inject(ProductService);
  private seo = inject(SeoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isLoading = signal(true);
  error = signal<string | null>(null);
  
  fabrics = ['Silk', 'Cashmere', 'Wool', 'Silk Mix'];
  colors = ['Midnight Blue', 'Amber', 'Ivory', 'Saffron', 'Emerald', 'Rose', 'Black', 'Gold'];
  occasions = ['Evening', 'Casual', 'Wedding', 'Daywear'];

  currentFilters = toSignal(this.route.queryParams, { initialValue: {} as ProductFilters });

  products = toSignal(
    this.route.queryParams.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(params => this.productService.getProducts(params)),
      tap(() => {
        this.isLoading.set(false);
        this.error.set(null);
      })
    )
  );

  ngOnInit() {
    this.seo.updateTitle('The Collection');
    this.seo.updateMetaTags([
      { name: 'description', content: 'Explore our curated collection of premium pashminas, crafted with heritage and elegance.' }
    ]);
  }

  updateFilter(key: keyof ProductFilters, value: string | null) {
    const queryParams = { ...this.route.snapshot.queryParams };
    if (value) {
      queryParams[key] = value;
    } else {
      delete queryParams[key];
    }
    this.router.navigate([], { queryParams, replaceUrl: true });
  }

  clearAllFilters() {
    this.router.navigate([], { queryParams: {}, replaceUrl: true });
  }

  retry() {
    this.router.navigate([], { queryParams: { ...this.route.snapshot.queryParams, _t: Date.now() } });
  }
}
