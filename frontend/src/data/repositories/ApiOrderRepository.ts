import type { OrderRepository } from '../../domain/ports/OrderRepository';
import { checkout, getOrders } from '../../generated/shop-sdk';
import { toDomainOrder } from '../mappers/orderMapper';

export class ApiOrderRepository implements OrderRepository {
  async getAll() {
    const orders = await getOrders();
    return orders.map(toDomainOrder);
  }

  async checkout() {
    const order = await checkout();
    return order ? toDomainOrder(order) : null;
  }
}
