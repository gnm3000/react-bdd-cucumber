import type { CartItem } from '../types/cart';
import type { Order } from '../types/order';
import type { Product } from '../types/product';

const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const shopApi = {
  getProducts: () => request<Product[]>('/products'),
  getCart: () => request<CartItem[]>('/cart'),
  addToCart: (productId: string) =>
    request<CartItem[]>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity: 1 })
    }),
  removeFromCart: (productId: string) =>
    request<CartItem[]>(`/cart/items/${productId}`, {
      method: 'DELETE'
    }),
  checkout: () =>
    request<Order | null>('/orders/checkout', {
      method: 'POST'
    }),
  getOrders: () => request<Order[]>('/orders')
};
