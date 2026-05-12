import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Cart } from '../../domain/entities/Cart';
import { useShopDependencies } from '../dependencies/ShopDependenciesContext';

const cartKey = ['cart'];
const productsKey = ['products'];
const ordersKey = ['orders'];

export function useProducts() {
  const dependencies = useShopDependencies();

  return useQuery({
    queryKey: productsKey,
    queryFn: () => dependencies.getProductsUseCase.execute()
  });
}

export function useCart() {
  const dependencies = useShopDependencies();

  return useQuery({
    queryKey: cartKey,
    queryFn: () => dependencies.getCartUseCase.execute()
  });
}

export function useOrders() {
  const dependencies = useShopDependencies();

  return useQuery({
    queryKey: ordersKey,
    queryFn: () => dependencies.getOrdersUseCase.execute()
  });
}

export function useAddToCart() {
  const dependencies = useShopDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => dependencies.addToCartUseCase.execute(productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKey });
    }
  });
}

export function useRemoveFromCart() {
  const dependencies = useShopDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => dependencies.removeFromCartUseCase.execute(productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKey });
    }
  });
}

export function useCheckout() {
  const dependencies = useShopDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cart: Cart) => dependencies.checkoutUseCase.execute(cart),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKey });
      void queryClient.invalidateQueries({ queryKey: ordersKey });
    }
  });
}
