import type { Product } from './Product';
import type { CartItem } from './CartItem';

export class Cart {
  constructor(public readonly items: CartItem[]) {}

  get itemCount(): number {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  total(products: Product[]): number {
    return this.items.reduce((acc, item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      return acc + (product?.price ?? 0) * item.quantity;
    }, 0);
  }

  hasProduct(productId: string): boolean {
    return this.items.some((item) => item.productId === productId);
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  get canCheckout(): boolean {
    return !this.isEmpty;
  }
}
