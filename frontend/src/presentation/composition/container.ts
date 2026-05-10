import { ApiCartRepository } from '../../data/repositories/ApiCartRepository';
import { ApiOrderRepository } from '../../data/repositories/ApiOrderRepository';
import { ApiProductRepository } from '../../data/repositories/ApiProductRepository';
import { AddToCartUseCase } from '../../application/use-cases/AddToCartUseCase';
import { CheckoutUseCase } from '../../application/use-cases/CheckoutUseCase';
import { GetCartUseCase } from '../../application/use-cases/GetCartUseCase';
import { GetOrdersUseCase } from '../../application/use-cases/GetOrdersUseCase';
import { GetProductsUseCase } from '../../application/use-cases/GetProductsUseCase';
import { RemoveFromCartUseCase } from '../../application/use-cases/RemoveFromCartUseCase';
import { CartService } from '../../domain/services/CartService';

const productRepository = new ApiProductRepository();
const cartRepository = new ApiCartRepository();
const orderRepository = new ApiOrderRepository();
const cartService = new CartService();

export const container = {
  getProductsUseCase: new GetProductsUseCase(productRepository),
  getCartUseCase: new GetCartUseCase(cartRepository),
  addToCartUseCase: new AddToCartUseCase(cartRepository, productRepository, cartService),
  removeFromCartUseCase: new RemoveFromCartUseCase(cartRepository, cartService),
  getOrdersUseCase: new GetOrdersUseCase(orderRepository),
  checkoutUseCase: new CheckoutUseCase(orderRepository, cartService)
};
