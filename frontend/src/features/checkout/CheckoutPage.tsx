import { Link } from 'react-router-dom';
import { useCart, useCheckout, useProducts } from '../../hooks/useShopData';
import type { CartItem } from '../../types/cart';
import type { Product } from '../../types/product';

export function CheckoutPage() {
  const { data: cart = [] } = useCart();
  const { data: products = [] } = useProducts();
  const checkout = useCheckout();

  const total = cart.reduce((acc: number, item: CartItem) => {
    const product = products.find((p: Product) => p.id === item.product_id);
    return acc + (product?.price ?? 0) * item.quantity;
  }, 0);

  return (
    <main className="space-y-6">
      <section>
        <p data-testid="checkout-total">Order total: ${total}</p>
        <button
          data-testid="confirm-order"
          disabled={!cart.length}
          onClick={() => checkout.mutate()}
          type="button"
        >
          Confirm order (auto-paid)
        </button>
        <Link data-testid="go-orders" to="/orders">
          View orders
        </Link>
      </section>
    </main>
  );
}
