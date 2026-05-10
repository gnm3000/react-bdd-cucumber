import { addCartItem, getCart, removeCartItem } from '../../generated/shop-sdk';
import type { CartItem } from '../../generated/shop-sdk';

export class RestCartDataSource {
  getCurrent(): Promise<CartItem[]> {
    return getCart();
  }

  add(productId: string): Promise<CartItem[]> {
    return addCartItem({ product_id: productId, quantity: 1 });
  }

  remove(productId: string): Promise<CartItem[]> {
    return removeCartItem(productId);
  }
}
