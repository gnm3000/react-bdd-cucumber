import type { Cart } from '../entities/Cart';
import type { Product } from '../entities/Product';

export class CartService {
  ensureCanAddProduct(product: Product | null): asserts product is Product {
    if (!product) throw new Error('Product not found');
  }

  ensureCanRemoveProduct(cart: Cart, productId: string): void {
    if (!cart.hasProduct(productId)) throw new Error('Product is not in the cart');
  }

  ensureCanCheckout(cart: Cart): void {
    if (cart.isEmpty) throw new Error('Cannot checkout an empty cart');
  }
}
