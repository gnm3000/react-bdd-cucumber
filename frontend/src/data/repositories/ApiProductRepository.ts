import type { ProductRepository } from '../../domain/ports/ProductRepository';
import { httpClient } from '../api/httpClient';
import { toDomainProduct } from '../mappers/productMapper';

export class ApiProductRepository implements ProductRepository {
  async getAll() {
    const products = await httpClient<Array<{ id: string; name: string; price: number }>>('/products');
    return products.map(toDomainProduct);
  }
}
