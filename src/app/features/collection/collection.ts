import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../core/services/product';
import { SeoService } from '../../core/services/seo';
import { ProductFilters } from '../../core/models/product';
import { ProductCardComponent } from '../../shared/components/product-card';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, MatIconModule, ProductCardComponent],
  templateUrl: './collection.html',
  styleUrl: './collection.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent implements OnInit {
  private productService = inject(ProductService);
  private seo = inject(SeoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isLoading = signal(true);
  error = signal<string | null>(null);

  /** Controls whether the filter chip rows are expanded */
  filtersOpen = signal(false);
  toggleFilters() { this.filtersOpen.update(v => !v); }

  /** Controls the Sort By dropdown */
  openSort = signal(false);
  toggleSort() { this.openSort.update(v => !v); }
  closeSort() { this.openSort.set(false); }

  fabrics = ['Silk', 'Cashmere', 'Wool', 'Silk Mix'];
  colors = ['Midnight Blue', 'Amber', 'Ivory', 'Saffron', 'Emerald', 'Rose', 'Black', 'Gold'];

  currentFilters = toSignal(this.route.queryParams, { initialValue: {} as ProductFilters });

  products = toSignal(
    this.route.queryParams.pipe(
      tap(() => { this.isLoading.set(true); this.error.set(null); }),
      switchMap(params =>
        this.productService.getProducts(params).pipe(
          tap(() => this.isLoading.set(false)),
          catchError(err => {
            this.error.set(err?.message ?? 'Something went wrong');
            this.isLoading.set(false);
            return of([]);
          })
        )
      )
    )
  );

  ngOnInit() {
    this.seo.updateTitle('The Collection');
    this.seo.updateMetaTags([
      { name: 'description', content: 'Explore our curated collection of premium pashminas, crafted with heritage and elegance.' }
    ]);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  /**
   * Toggles a value within a comma-separated multi-select query param.
   * E.g. clicking "Silk" when fabric="Cashmere" → fabric="Cashmere,Silk"
   * Clicking "Silk" again → fabric="Cashmere"
   */
  toggleChip(key: 'fabric' | 'color', value: string): void {
    const queryParams = { ...this.route.snapshot.queryParams };
    const current: string[] = queryParams[key] ? queryParams[key].split(',') : [];
    const idx = current.indexOf(value);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(value);
    }
    if (current.length === 0) {
      delete queryParams[key];
    } else {
      queryParams[key] = current.join(',');
    }
    this.router.navigate([], { queryParams, replaceUrl: true });
  }

  /** Returns true when a chip value is active in the current filter params. */
  isChipActive(key: 'fabric' | 'color', value: string): boolean {
    const param = this.currentFilters()?.[key as keyof ProductFilters] as string | undefined;
    return !!param && param.split(',').includes(value);
  }

  /** Returns how many chips are active for a given filter key. */
  activeCount(key: 'fabric' | 'color'): number {
    const param = this.currentFilters()?.[key as keyof ProductFilters] as string | undefined;
    return param ? param.split(',').filter(Boolean).length : 0;
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
