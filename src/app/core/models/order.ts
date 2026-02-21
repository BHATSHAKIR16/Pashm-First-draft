import { CartItem } from './product';

export interface Order {
  id?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    country: string;
  };
  items: CartItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}
