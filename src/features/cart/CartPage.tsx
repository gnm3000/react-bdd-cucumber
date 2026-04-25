import { Link } from 'react-router-dom';
import { useStore } from '../../state/store';

export function CartPage() {
  const cart = useStore((state) => state.cart);
  const products = useStore((state) => state.products);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const total = useStore((state) => state.cartTotal());

  return (
    <main>
      <h1>Cart</h1>
      <Link to="/">Back to products</Link>
      <ul data-testid="cart-items">
        {cart.length === 0 && <li>Your cart is empty</li>}
        {cart.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;

          return (
            <li key={item.productId}>
              <span>{product.name}</span>
              <span data-testid={`qty-${product.name}`}> Qty: {item.quantity}</span>
              <button
                data-testid={`remove-${product.name}`}
                onClick={() => removeFromCart(item.productId)}
                type="button"
              >
                Remove one
              </button>
            </li>
          );
        })}
      </ul>
      <p data-testid="cart-total">Total: ${total}</p>
      <Link data-testid="go-checkout" to="/checkout">
        Go to checkout
      </Link>
    </main>
  );
}
