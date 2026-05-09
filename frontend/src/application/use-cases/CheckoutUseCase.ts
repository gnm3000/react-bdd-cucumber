import type { Order } from '../../domain/entities/Order';
import type { CartRepository } from '../../domain/ports/CartRepository';
import type { OrderRepository } from '../../domain/ports/OrderRepository';
import type { CartService } from '../../domain/services/CartService';

export class CheckoutUseCase {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly orderRepository: OrderRepository,
    private readonly cartService: CartService
  ) {}

  async execute(): Promise<Order | null> {
    const cart = await this.cartRepository.getCurrent();
    this.cartService.ensureCanCheckout(cart);

    return this.orderRepository.checkout();
  }
}
