import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <header class="bg-brand-pearl/80 backdrop-blur-md sticky top-0 z-50 border-b border-brand-charcoal/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <nav class="hidden md:flex space-x-8 flex-1">
            <a routerLink="/" routerLinkActive="text-brand-gold" [routerLinkActiveOptions]="{exact: true}" class="text-[10px] font-medium text-brand-charcoal/70 hover:text-brand-gold transition-colors uppercase tracking-[0.2em]">Home</a>
            <a routerLink="/collection" routerLinkActive="text-brand-gold" class="text-[10px] font-medium text-brand-charcoal/70 hover:text-brand-gold transition-colors uppercase tracking-[0.2em]">Collection</a>
            <a routerLink="/about" routerLinkActive="text-brand-gold" class="text-[10px] font-medium text-brand-charcoal/70 hover:text-brand-gold transition-colors uppercase tracking-[0.2em]">About</a>
          </nav>

          <div class="flex-shrink-0 flex justify-center flex-1">
            <a routerLink="/" class="flex items-center">
              <span class="text-2xl font-serif font-normal tracking-[0.3em] text-brand-charcoal">AL-MASRAH</span>
            </a>
          </div>

          <div class="flex items-center justify-end space-x-6 flex-1">
            <button class="text-brand-charcoal/70 hover:text-brand-gold transition-colors">
              <mat-icon class="text-xl">search</mat-icon>
            </button>
            <button routerLink="/cart" class="relative text-brand-charcoal/70 hover:text-brand-gold transition-colors">
              <mat-icon class="text-xl">shopping_bag</mat-icon>
              @if (cart.totalItems() > 0) {
                <span class="absolute -top-1 -right-1 bg-brand-gold text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full animate-in fade-in zoom-in duration-300">
                  {{ cart.totalItems() }}
                </span>
              }
            </button>
            <button class="md:hidden text-brand-charcoal/70">
              <mat-icon>menu</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  cart = inject(CartService);
}
