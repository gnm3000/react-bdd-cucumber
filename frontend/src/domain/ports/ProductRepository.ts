import type { Product } from '../entities/Product';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  findById(productId: string): Promise<Product | null>;
}
