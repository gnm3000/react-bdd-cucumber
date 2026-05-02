import { Link } from 'react-router-dom';
import { useCart, useProducts, useRemoveFromCart } from '../../hooks/useShopData';
import type { CartItem } from '../../types/cart';
import type { Product } from '../../types/product';

export function CartPage() {
  const { data: cart = [] } = useCart();
  const { data: products = [] } = useProducts();
  const removeFromCart = useRemoveFromCart();

  const total = cart.reduce((acc: number, item: CartItem) => {
    const product = products.find((p: Product) => p.id === item.product_id);
    return acc + (product?.price ?? 0) * item.quantity;
  }, 0);

  return (
    <main className="space-y-6">
      <ul className="grid gap-4" data-testid="cart-items">
        {cart.length === 0 && <li>Your cart is empty</li>}
        {cart.map((item: CartItem) => {
          const product = products.find((p: Product) => p.id === item.product_id);
          if (!product) return null;

          return (
            <li key={item.product_id}>
              <span>{product.name}</span>
              <span data-testid={`qty-${product.name}`}>Qty: {item.quantity}</span>
              <button
                data-testid={`remove-${product.name}`}
                onClick={() => removeFromCart.mutate(item.product_id)}
                type="button"
              >
                Remove one
              </button>
            </li>
          );
        })}
      </ul>

      <section>
        <p data-testid="cart-total">Total: ${total}</p>
        <Link data-testid="go-checkout" to="/checkout">
          Go to checkout
        </Link>
      </section>
    </main>
  );
}
