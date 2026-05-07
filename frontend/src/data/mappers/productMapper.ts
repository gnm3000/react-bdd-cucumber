import { Product } from '../../domain/entities/Product';
import type { Product as ProductDto } from '../../generated/shop-sdk';

export function toDomainProduct(dto: ProductDto): Product {
  return new Product(dto.id, dto.name, dto.price);
}
