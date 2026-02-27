import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart';
import { OrderService } from '../../core/services/order';
import { SeoService } from '../../core/services/seo';
import { Order } from '../../core/models/order';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  public cart = inject(CartService);
  private orderService = inject(OrderService);
  private seo = inject(SeoService);
  private router = inject(Router);

  checkoutForm: FormGroup;
  isLoading = signal(false);
  isSuccess = signal(false);
  error = signal<string | null>(null);

  countries = [
    'United Arab Emirates',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
    'Jordan',
    'Lebanon',
    'Egypt'
  ];

  constructor() {
    this.seo.updateTitle('Checkout');

    // Redirect if cart is empty
    if (this.cart.items().length === 0) {
      this.router.navigate(['/cart']);
    }

    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      country: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  get f() { return this.checkoutForm.controls; }

  onSubmit() {
    if (this.checkoutForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.error.set(null);

    const order: Order = {
      customer: this.checkoutForm.value,
      items: this.cart.items(),
      totalAmount: this.cart.totalPrice(),
      currency: 'AED',
      status: 'pending',
      createdAt: new Date()
    };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
        this.cart.clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.message || 'An unexpected error occurred. Please try again.');
      }
    });
  }
}
