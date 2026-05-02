import type { CartItem } from './cart';

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: 'paid';
}
