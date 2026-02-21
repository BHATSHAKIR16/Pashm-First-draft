import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="group cursor-pointer">
      <div class="relative aspect-[3/4] overflow-hidden mb-6 product-frame">
        <img
          [src]="product().images[0]"
          [alt]="product().name"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
          <button 
            (click)="$event.stopPropagation(); cart.addItem(product())"
            class="bg-white text-brand-charcoal px-6 py-2 text-[10px] uppercase tracking-widest font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-brand-charcoal hover:text-white"
          >
            Add to Bag
          </button>
        </div>
      </div>
      
      <div class="text-center" [routerLink]="['/product', product().slug]">
        <h3 class="text-lg font-serif mb-1 group-hover:text-brand-gold transition-colors">{{ product().name }}</h3>
        <p class="text-xs text-brand-gold uppercase tracking-widest font-medium">
          {{ product().price | number }} {{ product().currency }}
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  product = input.required<Product>();
  cart = inject(CartService);
}
