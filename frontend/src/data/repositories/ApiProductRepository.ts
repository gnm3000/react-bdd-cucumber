import type { ProductRepository } from '../../domain/ports/ProductRepository';
import { RestProductDataSource } from '../datasources/RestProductDataSource';
import { toDomainProduct } from '../mappers/productMapper';

export class ApiProductRepository implements ProductRepository {
  constructor(private readonly dataSource = new RestProductDataSource()) {}

  async getAll() {
    const products = await this.dataSource.getAll();
    return products.map(toDomainProduct);
  }

  async findById(productId: string) {
    const products = await this.getAll();
    return products.find((product) => product.id === productId) ?? null;
  }
}
