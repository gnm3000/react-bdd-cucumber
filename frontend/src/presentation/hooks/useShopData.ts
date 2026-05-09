import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { container } from '../composition/container';

const cartKey = ['cart'];
const productsKey = ['products'];
const ordersKey = ['orders'];

export function useProducts() {
  return useQuery({
    queryKey: productsKey,
    queryFn: () => container.getProductsUseCase.execute()
  });
}

export function useCart() {
  return useQuery({
    queryKey: cartKey,
    queryFn: () => container.getCartUseCase.execute()
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ordersKey,
    queryFn: () => container.getOrdersUseCase.execute()
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => container.addToCartUseCase.execute(productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKey });
    }
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => container.removeFromCartUseCase.execute(productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKey });
    }
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => container.checkoutUseCase.execute(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKey });
      void queryClient.invalidateQueries({ queryKey: ordersKey });
    }
  });
}
