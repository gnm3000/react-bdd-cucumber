import { ApiProductRepository } from '../../data/repositories/ApiProductRepository';
import { GetProductsUseCase } from '../../domain/use-cases/GetProductsUseCase';

const productRepository = new ApiProductRepository();

export const container = {
  getProductsUseCase: new GetProductsUseCase(productRepository)
};
