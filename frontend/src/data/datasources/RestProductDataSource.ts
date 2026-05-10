import { getProducts } from '../../generated/shop-sdk';
import type { Product } from '../../generated/shop-sdk';

export class RestProductDataSource {
  getAll(): Promise<Product[]> {
    return getProducts();
  }
}
