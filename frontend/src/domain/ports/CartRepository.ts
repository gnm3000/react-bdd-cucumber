import type { Cart } from '../entities/Cart';

export interface CartRepository {
  getCurrent(): Promise<Cart>;
  add(productId: string): Promise<void>;
  remove(productId: string): Promise<void>;
}
