import type { Cart } from '../../domain/entities/Cart';
import type { Order } from '../../domain/entities/Order';
import type { OrderRepository } from '../../domain/ports/OrderRepository';
import type { CartService } from '../../domain/services/CartService';

export class CheckoutUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartService: CartService
  ) {}

  execute(cart: Cart): Promise<Order | null> {
    this.cartService.ensureCanCheckout(cart);

    return this.orderRepository.checkout();
  }
}
