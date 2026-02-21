import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then(m => m.HomeComponent)
      },
      {
        path: 'collection',
        loadComponent: () => import('./features/collection/collection').then(m => m.CollectionComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart').then(m => m.CartComponent)
      },
      {
        path: 'product/:slug',
        loadComponent: () => import('./features/product-detail/product-detail').then(m => m.ProductDetailComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
