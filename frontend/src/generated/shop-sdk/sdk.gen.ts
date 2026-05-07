// This file mirrors an SDK generated from openapi/shop.openapi.yaml.
// Regenerate with `pnpm run generate:sdk` after changing the OpenAPI contract.

import { request } from './client.gen';
import type { AddCartItemRequest, CartItem, Order, Product } from './types.gen';

export function getProducts() {
  return request<Product[]>('/products');
}

export function getCart() {
  return request<CartItem[]>('/cart');
}

export function addCartItem(body: AddCartItemRequest) {
  return request<CartItem[]>('/cart/items', {
    method: 'POST',
    body
  });
}

export function removeCartItem(productId: string) {
  return request<CartItem[]>(`/cart/items/${productId}`, {
    method: 'DELETE'
  });
}

export function checkout() {
  return request<Order | null>('/orders/checkout', {
    method: 'POST'
  });
}

export function getOrders() {
  return request<Order[]>('/orders');
}
