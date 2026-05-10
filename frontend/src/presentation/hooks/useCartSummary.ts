import { useCart, useProducts } from './useShopData';

export function useCartSummary() {
  const cartQuery = useCart();
  const productsQuery = useProducts();
  const cart = cartQuery.data;
  const products = productsQuery.data ?? [];

  return {
    cart,
    cartItems: cart?.items ?? [],
    products,
    cartCount: cart?.itemCount ?? 0,
    cartTotal: cart?.total(products) ?? 0
  };
}
