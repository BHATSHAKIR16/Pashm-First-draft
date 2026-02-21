import { Injectable, signal, computed, effect } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, CartItem } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  // Using signals for easier template integration where possible
  items = signal<CartItem[]>([]);
  
  totalItems = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
  totalPrice = computed(() => this.items().reduce((acc, item) => acc + (item.price * item.quantity), 0));

  constructor() {
    this.loadCart();
    
    // Sync signal with BehaviorSubject for backward compatibility or specific RXJS needs
    this.cartItems$.subscribe(items => {
      this.items.set(items);
    });

    // Persist to localStorage on every change
    effect(() => {
      this.saveCart(this.items());
    });
  }

  addItem(product: Product) {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      this.updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = { ...product, quantity: 1 };
      this.cartItemsSubject.next([...currentItems, newItem]);
    }
  }

  removeItem(productId: string) {
    const currentItems = this.cartItemsSubject.value;
    this.cartItemsSubject.next(currentItems.filter(item => item.id !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item => 
      item.id === productId ? { ...item, quantity } : item
    );
    this.cartItemsSubject.next(updatedItems);
  }

  clearCart() {
    this.cartItemsSubject.next([]);
  }

  private saveCart(items: CartItem[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('al_masrah_cart', JSON.stringify(items));
    }
  }

  private loadCart() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedCart = localStorage.getItem('al_masrah_cart');
      if (savedCart) {
        try {
          this.cartItemsSubject.next(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e);
          this.cartItemsSubject.next([]);
        }
      }
    }
  }
}
