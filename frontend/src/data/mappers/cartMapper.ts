import { Cart } from '../../domain/entities/Cart';
import { CartItem } from '../../domain/entities/CartItem';
import type { CartItem as CartItemDto } from '../../generated/shop-sdk';

export function toDomainCartItem(dto: CartItemDto): CartItem {
  return new CartItem(dto.product_id, dto.quantity);
}

export function toDomainCart(dtos: CartItemDto[]): Cart {
  return new Cart(dtos.map(toDomainCartItem));
}
