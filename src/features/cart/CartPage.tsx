import { Link } from 'react-router-dom';
import { useStore } from '../../state/store';

export function CartPage() {
  const cart = useStore((state) => state.cart);
  const products = useStore((state) => state.products);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const total = useStore((state) => state.cartTotal());

  return (
    <main className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              Cart overview
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Cart</h2>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            to="/"
          >
            Back to products
          </Link>
        </div>
      </section>

      <ul className="grid gap-4" data-testid="cart-items">
        {cart.length === 0 && (
          <li className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-slate-500 shadow-soft">
            Your cart is empty
          </li>
        )}
        {cart.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;

          return (
            <li
              className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:grid-cols-[minmax(0,1fr)_auto]"
              key={item.productId}
            >
              <div className="space-y-2">
                <span className="block text-lg font-semibold text-slate-900">{product.name}</span>
                <span className="block text-sm text-slate-500" data-testid={`qty-${product.name}`}>
                  Qty: {item.quantity}
                </span>
                <p className="text-sm text-slate-500">Unit price: ${product.price}</p>
              </div>
              <button
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
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

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xl font-semibold text-slate-900" data-testid="cart-total">
            Total: ${total}
          </p>
          <Link
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            data-testid="go-checkout"
            to="/checkout"
          >
            Go to checkout
          </Link>
        </div>
      </section>
    </main>
  );
}
