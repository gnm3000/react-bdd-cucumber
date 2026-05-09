import type { CartRepository } from '../../domain/ports/CartRepository';
import { addCartItem, getCart, removeCartItem } from '../../generated/shop-sdk';
import { toDomainCart } from '../mappers/cartMapper';

export class ApiCartRepository implements CartRepository {
  async getCurrent() {
    const cart = await getCart();
    return toDomainCart(cart);
  }

  async add(productId: string) {
    const cart = await addCartItem({ product_id: productId, quantity: 1 });
    return toDomainCart(cart);
  }

  async remove(productId: string) {
    const cart = await removeCartItem(productId);
    return toDomainCart(cart);
  }
}
