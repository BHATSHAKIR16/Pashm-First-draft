import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product, ProductFilters } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Celestial Midnight',
      slug: 'celestial-midnight',
      description: 'A deep, dark pashmina that captures the essence of a starless night.',
      price: 1250,
      currency: 'AED',
      images: ['https://picsum.photos/seed/p1/600/800'],
      colors: ['Midnight Blue'],
      fabric: 'Silk',
      occasion: 'Evening',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Heritage Amber',
      slug: 'heritage-amber',
      description: 'Warm tones of amber woven with traditional patterns.',
      price: 2100,
      currency: 'AED',
      images: ['https://picsum.photos/seed/p2/600/800'],
      colors: ['Amber'],
      fabric: 'Cashmere',
      occasion: 'Casual',
      rating: 4.9
    },
    {
      id: '3',
      name: 'Ivory Whisper',
      slug: 'ivory-whisper',
      description: 'Delicate ivory silk that feels like a gentle breeze.',
      price: 3400,
      currency: 'AED',
      images: ['https://picsum.photos/seed/p3/600/800'],
      colors: ['Ivory'],
      fabric: 'Silk',
      occasion: 'Wedding',
      rating: 5.0
    },
    {
      id: '4',
      name: 'Saffron Sands',
      slug: 'saffron-sands',
      description: 'The vibrant color of saffron meets the softness of desert sands.',
      price: 1850,
      currency: 'AED',
      images: ['https://picsum.photos/seed/p4/600/800'],
      colors: ['Saffron'],
      fabric: 'Wool',
      occasion: 'Daywear',
      rating: 4.7
    },
    {
      id: '5',
      name: 'Verdant Court',
      slug: 'verdant-court',
      description: 'Rich green tones inspired by royal gardens.',
      price: 1400,
      currency: 'AED',
      images: ['https://picsum.photos/seed/p5/600/800'],
      colors: ['Emerald'],
      fabric: 'Silk',
      occasion: 'Evening',
      rating: 4.6
    },
    {
      id: '6',
      name: 'Desert Rose',
      slug: 'desert-rose',
      description: 'A soft pink hue that blooms in the heart of the dunes.',
      price: 2250,
      currency: 'AED',
      images: ['https://picsum.photos/seed/p6/600/800'],
      colors: ['Rose'],
      fabric: 'Cashmere',
      occasion: 'Casual',
      rating: 4.8
    },
    {
      id: '7',
      name: 'Obsidian Silk',
      slug: 'obsidian-silk',
      description: 'Pure black silk with a mirror-like finish.',
      price: 1100,
      currency: 'AED',
      images: ['https://picsum.photos/seed/p7/600/800'],
      colors: ['Black'],
      fabric: 'Silk',
      occasion: 'Evening',
      rating: 4.9
    },
    {
      id: '8',
      name: 'Gilded Threads',
      slug: 'gilded-threads',
      description: 'Woven with real gold threads for ultimate luxury.',
      price: 4200,
      currency: 'AED',
      images: ['https://picsum.photos/seed/p8/600/800'],
      colors: ['Gold'],
      fabric: 'Silk Mix',
      occasion: 'Wedding',
      rating: 5.0
    }
  ];

  getProducts(filters: ProductFilters = {}): Observable<Product[]> {
    let filtered = [...this.mockProducts];

    if (filters.fabric) {
      filtered = filtered.filter(p => p.fabric.toLowerCase() === filters.fabric?.toLowerCase());
    }
    if (filters.color) {
      filtered = filtered.filter(p => p.colors.some(c => c.toLowerCase() === filters.color?.toLowerCase()));
    }
    if (filters.occasion) {
      filtered = filtered.filter(p => p.occasion.toLowerCase() === filters.occasion?.toLowerCase());
    }

    if (filters.sort) {
      switch (filters.sort) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          // Mocking newest by reversing
          filtered.reverse();
          break;
      }
    }

    return of(filtered).pipe(delay(800)); // Simulate network delay
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.slug === slug);
    return of(product).pipe(delay(500));
  }

  getRelatedProducts(productId: string): Observable<Product[]> {
    const related = this.mockProducts
      .filter(p => p.id !== productId)
      .slice(0, 4);
    return of(related).pipe(delay(500));
  }

  getFeaturedProducts(): Observable<Product[]> {
    return of(this.mockProducts.slice(0, 3)).pipe(delay(500));
  }
}
