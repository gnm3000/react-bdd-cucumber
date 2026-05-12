import { Link } from 'react-router-dom';
import { useCartSummary } from '../hooks/useCartSummary';
import { useRemoveFromCart } from '../hooks/useShopData';

export function CartPage() {
  const { cartLines, cartTotal, isCartEmpty } = useCartSummary();
  const removeFromCart = useRemoveFromCart();

  return (
    <main className="space-y-6">
      <ul className="grid gap-4" data-testid="cart-items">
        {isCartEmpty && <li>Your cart is empty</li>}
        {cartLines.map((line) => (
          <li key={line.productId}>
            <span>{line.productName}</span>
            <span data-testid={`qty-${line.productName}`}>Qty: {line.quantity}</span>
            <button
              data-testid={`remove-${line.productName}`}
              onClick={() => removeFromCart.mutate(line.productId)}
              type="button"
            >
              Remove one
            </button>
          </li>
        ))}
      </ul>

      <section>
        <p data-testid="cart-total">Total: ${cartTotal}</p>
        <Link data-testid="go-checkout" to="/checkout">
          Go to checkout
        </Link>
      </section>
    </main>
  );
}
