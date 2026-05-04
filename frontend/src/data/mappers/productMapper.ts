import { Product } from '../../domain/entities/Product';

type ProductDto = {
  id: string;
  name: string;
  price: number;
};

export function toDomainProduct(dto: ProductDto): Product {
  return new Product(dto.id, dto.name, dto.price);
}
