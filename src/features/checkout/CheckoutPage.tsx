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
    <main className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
          Checkout
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Checkout</h2>
        <p className="mt-3 text-sm text-slate-500">
          Single fixed user. No real payment provider connected.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <p className="text-sm text-slate-500">Ready to confirm</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900" data-testid="checkout-total">
              Order total: ${total}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              data-testid="confirm-order"
              disabled={!canConfirm}
              onClick={onConfirm}
              type="button"
            >
              Confirm order (auto-paid)
            </button>
            <Link
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              data-testid="go-orders"
              to="/orders"
            >
              View orders
            </Link>
          </div>
        </div>
        {!canConfirm && <p className="mt-4 text-sm text-amber-600">Cart is empty. Add products first.</p>}
      </section>
    </main>
  );
}
