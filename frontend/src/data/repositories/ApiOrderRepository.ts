import type { OrderRepository } from '../../domain/ports/OrderRepository';
import { RestOrderDataSource } from '../datasources/RestOrderDataSource';
import { toDomainOrder } from '../mappers/orderMapper';

export class ApiOrderRepository implements OrderRepository {
  constructor(private readonly dataSource = new RestOrderDataSource()) {}

  async getAll() {
    const orders = await this.dataSource.getAll();
    return orders.map(toDomainOrder);
  }

  async checkout() {
    const order = await this.dataSource.checkout();
    return order ? toDomainOrder(order) : null;
  }
}
