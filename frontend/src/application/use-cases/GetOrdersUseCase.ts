import type { Order } from '../../domain/entities/Order';
import type { OrderRepository } from '../../domain/ports/OrderRepository';

export class GetOrdersUseCase {
  constructor(private readonly repository: OrderRepository) {}

  execute(): Promise<Order[]> {
    return this.repository.getAll();
  }
}
