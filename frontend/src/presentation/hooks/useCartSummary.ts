import { useCart, useProducts } from './useShopData';

export interface CartSummaryLine {
  productId: string;
  productName: string;
  quantity: number;
}

export function useCartSummary() {
  const cartQuery = useCart();
  const productsQuery = useProducts();
  const cart = cartQuery.data;
  const products = productsQuery.data ?? [];
  const cartLines: CartSummaryLine[] =
    cart?.items.flatMap((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      if (!product) return [];

      return [
        {
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity
        }
      ];
    }) ?? [];

  return {
    cart,
    cartLines,
    cartCount: cart?.itemCount ?? 0,
    cartTotal: cart?.total(products) ?? 0,
    canCheckout: cart?.canCheckout ?? false,
    isCartEmpty: cart?.isEmpty ?? true
  };
}
