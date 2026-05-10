import type { CartRepository } from '../../domain/ports/CartRepository';
import { RestCartDataSource } from '../datasources/RestCartDataSource';
import { toDomainCart } from '../mappers/cartMapper';

export class ApiCartRepository implements CartRepository {
  constructor(private readonly dataSource = new RestCartDataSource()) {}

  async getCurrent() {
    const cart = await this.dataSource.getCurrent();
    return toDomainCart(cart);
  }

  async add(productId: string) {
    const cart = await this.dataSource.add(productId);
    return toDomainCart(cart);
  }

  async remove(productId: string) {
    const cart = await this.dataSource.remove(productId);
    return toDomainCart(cart);
  }
}
