import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule],
  template: `
    <footer class="bg-brand-sand text-brand-charcoal py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div class="md:col-span-1">
            <span class="text-2xl font-serif font-normal tracking-[0.3em] mb-6 block">AL-MASRAH</span>
            <p class="text-xs text-brand-charcoal/60 leading-relaxed max-w-xs">
              Redefining luxury pashmina for the modern connoisseur. Rooted in heritage, crafted for eternity.
            </p>
          </div>
          
          <div>
            <h4 class="text-[10px] uppercase tracking-[0.2em] font-bold mb-6">Collections</h4>
            <ul class="space-y-4">
              <li><a href="#" class="text-[10px] uppercase tracking-widest text-brand-charcoal/60 hover:text-brand-gold transition-colors">New Arrivals</a></li>
              <li><a href="#" class="text-[10px] uppercase tracking-widest text-brand-charcoal/60 hover:text-brand-gold transition-colors">Signature</a></li>
              <li><a href="#" class="text-[10px] uppercase tracking-widest text-brand-charcoal/60 hover:text-brand-gold transition-colors">Wholesale</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-[10px] uppercase tracking-[0.2em] font-bold mb-6">Heritage</h4>
            <ul class="space-y-4">
              <li><a href="#" class="text-[10px] uppercase tracking-widest text-brand-charcoal/60 hover:text-brand-gold transition-colors">Our Story</a></li>
              <li><a href="#" class="text-[10px] uppercase tracking-widest text-brand-charcoal/60 hover:text-brand-gold transition-colors">Craftsmanship</a></li>
              <li><a href="#" class="text-[10px] uppercase tracking-widest text-brand-charcoal/60 hover:text-brand-gold transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-[10px] uppercase tracking-[0.2em] font-bold mb-6">Newsletter</h4>
            <div class="relative">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                class="w-full bg-transparent border-b border-brand-charcoal/20 py-2 text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand-gold transition-colors"
              />
              <button class="absolute right-0 bottom-2 text-brand-charcoal/60 hover:text-brand-gold transition-colors">
                <mat-icon class="text-sm">arrow_forward</mat-icon>
              </button>
            </div>
          </div>
        </div>

        <div class="pt-8 border-t border-brand-charcoal/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-[10px] uppercase tracking-widest text-brand-charcoal/40">© 2024 AL-MASRAH. ALL RIGHTS RESERVED.</p>
          <div class="flex gap-8">
            <a href="#" class="text-[10px] uppercase tracking-widest text-brand-charcoal/40 hover:text-brand-gold transition-colors">Privacy</a>
            <a href="#" class="text-[10px] uppercase tracking-widest text-brand-charcoal/40 hover:text-brand-gold transition-colors">Terms</a>
          </div>
          <div class="flex gap-4">
            <mat-icon class="text-sm text-brand-charcoal/40">instagram</mat-icon>
            <mat-icon class="text-sm text-brand-charcoal/40">share</mat-icon>
            <mat-icon class="text-sm text-brand-charcoal/40">mail</mat-icon>
          </div>
        </div>
      </div>
    </footer>
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
export class FooterComponent {}
