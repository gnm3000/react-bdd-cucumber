import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useOrders } from '../presentation/hooks/useShopData';
import { useCartSummary } from '../presentation/hooks/useCartSummary';

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Catalog', to: '/' },
  { label: 'Checkout', to: '/checkout' },
  { label: 'Orders', to: '/orders' }
];

const navClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive ? 'bg-blue-600 text-white shadow-soft' : 'text-slate-600 hover:bg-slate-200'
  ].join(' ');

export function AppLayout({ children }: AppLayoutProps) {
  const { data: orders = [] } = useOrders();
  const { cartCount, cartTotal } = useCartSummary();

  return (
    <div className="min-h-screen bg-slate-50/80">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="container flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <span className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
              React + Cucumber
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">BDD Shop</h1>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <NavLink end={item.to === '/'} key={item.to} to={item.to} className={navClassName}>
                  {item.label}
                </NavLink>
              ))}
              <NavLink className={navClassName} data-testid="go-cart" to="/cart">
                Cart ({cartCount})
              </NavLink>
            </nav>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1">Session: QA Demo User</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Orders: {orders.length}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>{children}</div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Summary</p>
            <div className="mt-4 grid gap-4">
              <div className="rounded-2xl bg-brand-50 p-4">
                <p className="text-sm text-slate-500">Items in cart</p>
                <p className="mt-1 text-3xl font-semibold text-brand-700">{cartCount}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">Cart total</p>
                <p className="mt-1 text-3xl font-semibold text-slate-900">${cartTotal}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
