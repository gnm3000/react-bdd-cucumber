import type { ProductRepository } from '../../domain/ports/ProductRepository';
import { getProducts } from '../../generated/shop-sdk';
import { toDomainProduct } from '../mappers/productMapper';

export class ApiProductRepository implements ProductRepository {
  async getAll() {
    const products = await getProducts();
    return products.map(toDomainProduct);
  }
}
