import { addCartItem, getCart, removeCartItem } from '../../generated/shop-sdk';
import type { AddCartItemRequest, CartItem } from '../../generated/shop-sdk';

export class RestCartDataSource {
  getCurrent(): Promise<CartItem[]> {
    return getCart();
  }

  async add(request: AddCartItemRequest): Promise<void> {
    await addCartItem(request);
  }

  async remove(productId: string): Promise<void> {
    await removeCartItem(productId);
  }
}
