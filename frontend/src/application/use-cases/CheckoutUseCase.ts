import type { Cart } from '../../domain/entities/Cart';
import type { OrderRepository } from '../../domain/ports/OrderRepository';
import type { CartService } from '../../domain/services/CartService';

export class CheckoutUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartService: CartService
  ) {}

  async execute(cart: Cart): Promise<void> {
    this.cartService.ensureCanCheckout(cart);

    await this.orderRepository.checkout();
  }
}
