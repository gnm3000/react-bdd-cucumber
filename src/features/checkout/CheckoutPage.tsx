import { Link } from 'react-router-dom';
import { useStore } from '../../state/store';

export function CheckoutPage() {
  const cart = useStore((state) => state.cart);
  const total = useStore((state) => state.cartTotal());
  const checkout = useStore((state) => state.checkout);

  const canConfirm = cart.length > 0;

  const onConfirm = () => {
    checkout();
  };

  return (
    <main>
      <h1>Checkout</h1>
      <p>Single fixed user. No real payment provider connected.</p>
      <p data-testid="checkout-total">Order total: ${total}</p>
      <button
        data-testid="confirm-order"
        disabled={!canConfirm}
        onClick={onConfirm}
        type="button"
      >
        Confirm order (auto-paid)
      </button>
      {!canConfirm && <p>Cart is empty. Add products first.</p>}
      <div>
        <Link data-testid="go-orders" to="/orders">
          View orders
        </Link>
      </div>
    </main>
  );
}
