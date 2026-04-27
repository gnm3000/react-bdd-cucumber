import { Link } from 'react-router-dom';
import { useStore } from '../../state/store';

export function OrdersPage() {
  const orders = useStore((state) => state.orders);

  return (
    <main className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              Purchase history
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Orders</h2>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            to="/"
          >
            Back to products
          </Link>
        </div>
      </section>

      <ul className="grid gap-4" data-testid="orders-list">
        {orders.length === 0 && (
          <li className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-slate-500 shadow-soft">
            No orders yet
          </li>
        )}
        {orders.map((order) => (
          <li
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"
            key={order.id}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Order record
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Order #{order.id}</p>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                Total: ${order.total}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500" data-testid="order-status">
              {order.status}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
