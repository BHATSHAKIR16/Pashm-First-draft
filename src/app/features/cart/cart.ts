import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart';
import { SeoService } from '../../core/services/seo';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent implements OnInit {
  cart = inject(CartService);
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.updateTitle('Shopping Bag');
    this.seo.updateMetaTags([
      { name: 'description', content: 'Review your selection of premium pashminas before checkout.' }
    ]);
  }
}
