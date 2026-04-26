import type { CartItem } from './cart';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'paid';
}
