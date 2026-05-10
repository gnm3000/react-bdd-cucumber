import { Link } from 'react-router-dom';
import { useCartSummary } from '../../presentation/hooks/useCartSummary';
import { useRemoveFromCart } from '../../presentation/hooks/useShopData';

export function CartPage() {
  const { cartItems, products, cartTotal } = useCartSummary();
  const removeFromCart = useRemoveFromCart();

  return (
    <main className="space-y-6">
      <ul className="grid gap-4" data-testid="cart-items">
        {cartItems.length === 0 && <li>Your cart is empty</li>}
        {cartItems.map((item) => {
          const product = products.find((candidate) => candidate.id === item.productId);
          if (!product) return null;

          return (
            <li key={item.productId}>
              <span>{product.name}</span>
              <span data-testid={`qty-${product.name}`}>Qty: {item.quantity}</span>
              <button
                data-testid={`remove-${product.name}`}
                onClick={() => removeFromCart.mutate(item.productId)}
                type="button"
              >
                Remove one
              </button>
            </li>
          );
        })}
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
