import { Link } from 'react-router-dom';
import { useCartSummary } from '../../presentation/hooks/useCartSummary';
import { useCheckout } from '../../presentation/hooks/useShopData';

export function CheckoutPage() {
  const { cart, cartCount, cartTotal } = useCartSummary();
  const checkout = useCheckout();

  return (
    <main className="space-y-6">
      <section>
        <p data-testid="checkout-total">Order total: ${cartTotal}</p>
        <button
          data-testid="confirm-order"
          disabled={!cart || cartCount === 0}
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
