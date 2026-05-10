import type { CartRepository } from '../../domain/ports/CartRepository';
import type { ProductRepository } from '../../domain/ports/ProductRepository';
import type { CartService } from '../../domain/services/CartService';

export class AddToCartUseCase {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly cartService: CartService
  ) {}

  async execute(productId: string): Promise<void> {
    if (!productId.trim()) throw new Error('Product id is required to add an item to the cart');

    const product = await this.productRepository.findById(productId);
    this.cartService.ensureCanAddProduct(product);

    await this.cartRepository.add(product.id);
  }
}
