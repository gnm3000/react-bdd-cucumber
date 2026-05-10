import { Order } from '../../domain/entities/Order';
import type { Order as OrderDto } from '../../generated/shop-sdk';
import { toDomainCartItem } from './cartMapper';

export function toDomainOrder(dto: OrderDto): Order {
  return new Order(dto.id, dto.user_id, dto.items.map(toDomainCartItem), dto.total, dto.status);
}
