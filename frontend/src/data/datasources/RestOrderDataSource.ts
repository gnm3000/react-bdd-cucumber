import { checkout, getOrders } from '../../generated/shop-sdk';
import type { Order } from '../../generated/shop-sdk';

export class RestOrderDataSource {
  getAll(): Promise<Order[]> {
    return getOrders();
  }

  checkout(): Promise<Order | null> {
    return checkout();
  }
}
