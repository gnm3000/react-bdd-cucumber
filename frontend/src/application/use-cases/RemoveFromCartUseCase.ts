import type { CartRepository } from '../../domain/ports/CartRepository';
import type { CartService } from '../../domain/services/CartService';

export class RemoveFromCartUseCase {
  constructor(
    private readonly repository: CartRepository,
    private readonly cartService: CartService
  ) {}

  async execute(productId: string): Promise<void> {
    if (!productId.trim()) throw new Error('Product id is required to remove an item from the cart');

    const cart = await this.repository.getCurrent();
    this.cartService.ensureCanRemoveProduct(cart, productId);

    await this.repository.remove(productId);
  }
}
