import { Link } from 'react-router-dom';
import { useCartSummary } from '../../presentation/hooks/useCartSummary';
import { useCheckout } from '../../presentation/hooks/useShopData';

export function CheckoutPage() {
  const { cart, canCheckout, cartTotal } = useCartSummary();
  const checkout = useCheckout();

  return (
    <main className="space-y-6">
      <section>
        <p data-testid="checkout-total">Order total: ${cartTotal}</p>
        <button
          data-testid="confirm-order"
          disabled={!canCheckout}
          onClick={() => cart && checkout.mutate(cart)}
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
