import { describe, expect, it } from 'vitest';
import { Product } from '../../src/domain/entities/Product';
import { GetProductsUseCase } from '../../src/application/use-cases/GetProductsUseCase';
import type { ProductRepository } from '../../src/domain/ports/ProductRepository';

class InMemoryProductRepository implements ProductRepository {
  constructor(private readonly products: Product[]) {}

  getAll(): Promise<Product[]> {
    return Promise.resolve(this.products);
  }

  findById(productId: string): Promise<Product | null> {
    return Promise.resolve(this.products.find((product) => product.id === productId) ?? null);
  }
}

describe('GetProductsUseCase', () => {
  it('returns products when invariants are valid', async () => {
    const useCase = new GetProductsUseCase(
      new InMemoryProductRepository([new Product('1', 'Laptop', 2000)])
    );

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('Laptop');
  });

  it('fails when repository returns invalid product price', async () => {
    const useCase = new GetProductsUseCase(
      new InMemoryProductRepository([{ id: '1', name: 'Broken', price: -1 } as Product])
    );

    await expect(useCase.execute()).rejects.toThrow('Product list contains invalid prices');
  });
});
