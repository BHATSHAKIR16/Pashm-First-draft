import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';
import { CartService } from '../../core/services/cart';

/** Routes that have a full-bleed dark hero — header starts transparent */
const DARK_HERO_ROUTES = ['/', '/collection', '/about'];

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  cart = inject(CartService);
  private router = inject(Router);

  /** True once the user scrolls past ~80px, OR when on a light-background page */
  scrolled = signal(false);

  /** Controls the mobile drawer visibility */
  menuOpen = signal(false);

  ngOnInit() {
    // Set initial state based on current route (handles direct navigation / refresh)
    this.updateScrolledForRoute(this.router.url);

    // Update on every route change
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.updateScrolledForRoute(e.urlAfterRedirects);
        this.menuOpen.set(false);
      });
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const onHeroPage = DARK_HERO_ROUTES.includes(this.getCurrentBasePath());
    if (onHeroPage) {
      this.scrolled.set(window.scrollY > 80);
    }
    // On light pages scrolled stays true — no change needed
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  private updateScrolledForRoute(url: string) {
    const basePath = url.split('?')[0].split('#')[0];
    const isHeroPage = DARK_HERO_ROUTES.includes(basePath);
    // Hero pages: transparent at top (scroll listener handles it)
    // Light pages: always show frosted glass
    this.scrolled.set(!isHeroPage || window.scrollY > 80);
  }

  private getCurrentBasePath(): string {
    return this.router.url.split('?')[0].split('#')[0];
  }
}
