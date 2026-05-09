import type { Cart } from '../entities/Cart';

export interface CartRepository {
  getCurrent(): Promise<Cart>;
  add(productId: string): Promise<Cart>;
  remove(productId: string): Promise<Cart>;
}
