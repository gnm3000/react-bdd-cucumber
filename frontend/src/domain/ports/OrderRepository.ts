import type { Order } from '../entities/Order';

export interface OrderRepository {
  getAll(): Promise<Order[]>;
  checkout(): Promise<void>;
}
