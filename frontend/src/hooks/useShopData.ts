import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shopApi } from '../api/shopApi';

const cartKey = ['cart'];
const productsKey = ['products'];
const ordersKey = ['orders'];

export function useProducts() {
  return useQuery({ queryKey: productsKey, queryFn: shopApi.getProducts });
}

export function useCart() {
  return useQuery({ queryKey: cartKey, queryFn: shopApi.getCart });
}

export function useOrders() {
  return useQuery({ queryKey: ordersKey, queryFn: shopApi.getOrders });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shopApi.addToCart,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKey });
    }
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shopApi.removeFromCart,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKey });
    }
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shopApi.checkout,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKey });
      void queryClient.invalidateQueries({ queryKey: ordersKey });
    }
  });
}
