import type { Product } from '../../domain/entities/Product';
import type { ProductRepository } from '../../domain/ports/ProductRepository';

export class GetProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    const products = await this.repository.getAll();

    if (products.some((product) => product.price < 0)) {
      throw new Error('Product list contains invalid prices');
    }

    return products;
  }
}
