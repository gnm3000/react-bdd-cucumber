import { Link } from 'react-router-dom';
import { useStore } from '../../state/store';

export function ProductListPage() {
  const products = useStore((state) => state.products);
  const addToCart = useStore((state) => state.addToCart);

  return (
    <main className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              Product catalog
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Product Catalog</h2>
            <p className="max-w-2xl text-sm text-slate-500">
              Fixed user session: QA Demo User. El catalogo usa tarjetas limpias en una grilla
              responsive.
            </p>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            to="/cart"
          >
            Review cart
          </Link>
        </div>
      </section>

      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <li
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-brand-200"
            key={product.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Featured item
                </p>
                <strong className="mt-2 block text-xl font-semibold text-slate-900">
                  {product.name}
                </strong>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                ${product.price}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Demo product ready for cart and checkout validation.
            </p>
            <button
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              data-testid={`add-${product.name}`}
              onClick={() => addToCart(product.id)}
              type="button"
            >
              Add to cart
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
