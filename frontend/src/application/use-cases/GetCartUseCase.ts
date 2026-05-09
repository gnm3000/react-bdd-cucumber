import type { Cart } from '../../domain/entities/Cart';
import type { CartRepository } from '../../domain/ports/CartRepository';

export class GetCartUseCase {
  constructor(private readonly repository: CartRepository) {}

  execute(): Promise<Cart> {
    return this.repository.getCurrent();
  }
}
