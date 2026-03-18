import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product';
import { RouterLink } from '@angular/router';
import { LangLinkPipe } from '../../core/pipes/lang-link.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, LangLinkPipe],
  template: `
    <div class="group cursor-pointer">
      <div class="relative aspect-[3/4] overflow-hidden mb-6 product-frame" [routerLink]="'/product/' + product().slug | langLink">
        <img
          [src]="product().images[0]"
          [alt]="product().name"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />

        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
      </div>
      
      <div class="text-center" [routerLink]="'/product/' + product().slug | langLink">
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
}
