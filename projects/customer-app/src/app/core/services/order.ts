import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // In a real app, this would be your API URL
  private apiUrl = '/api/orders';

  createOrder(order: Order): Observable<Order> {
    // Simulating a real API call
    console.log('Submitting order to POST /orders:', order);
    
    // For demo purposes, we'll simulate a successful response
    return of({
      ...order,
      id: Math.random().toString(36).substring(7),
      status: 'confirmed' as const
    }).pipe(
      delay(2000), // Simulate network latency
      catchError(error => {
        console.error('Order submission failed', error);
        return throwError(() => new Error('Failed to process your order. Please try again.'));
      })
    );
  }
}
