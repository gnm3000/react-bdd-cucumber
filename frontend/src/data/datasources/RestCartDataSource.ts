import { addCartItem, getCart, removeCartItem } from '../../generated/shop-sdk';
import type { CartItem } from '../../generated/shop-sdk';

export class RestCartDataSource {
  getCurrent(): Promise<CartItem[]> {
    return getCart();
  }

  async add(productId: string): Promise<void> {
    await addCartItem({ product_id: productId, quantity: 1 });
  }

  async remove(productId: string): Promise<void> {
    await removeCartItem(productId);
  }
}
