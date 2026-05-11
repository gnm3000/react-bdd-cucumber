import type { CartRepository } from '../../domain/ports/CartRepository';
import { RestCartDataSource } from '../datasources/RestCartDataSource';
import { toAddCartItemRequest, toDomainCart } from '../mappers/cartMapper';

export class ApiCartRepository implements CartRepository {
  constructor(private readonly dataSource = new RestCartDataSource()) {}

  async getCurrent() {
    const cart = await this.dataSource.getCurrent();
    return toDomainCart(cart);
  }

  async add(productId: string): Promise<void> {
    await this.dataSource.add(toAddCartItemRequest(productId));
  }

  async remove(productId: string): Promise<void> {
    await this.dataSource.remove(productId);
  }
}
