import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  cart = inject(CartService);
}
