export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  colors: string[];
  fabric: string;
  occasion: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ProductFilters {
  fabric?: string;
  color?: string;
  occasion?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest';
}
