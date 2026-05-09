import { Link } from 'react-router-dom';
import { useAddToCart, useProducts } from '../hooks/useShopData';

export function ProductListPage() {
  const { data: products = [] } = useProducts();
  const addToCart = useAddToCart();

  return (
    <main className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Product Catalog</h2>
        <Link className="mt-4 inline-flex rounded-full border px-4 py-2" to="/cart">
          Review cart
        </Link>
      </section>

      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <li className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft" key={product.id}>
            <strong className="block text-xl font-semibold text-slate-900">{product.name}</strong>
            <span className="mt-2 block">${product.price}</span>
            <button
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
              data-testid={`add-${product.name}`}
              onClick={() => addToCart.mutate(product.id)}
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
