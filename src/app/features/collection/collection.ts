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
