import { Link } from 'react-router-dom';
import { useStore } from '../../state/store';

export function ProductListPage() {
  const products = useStore((state) => state.products);
  const addToCart = useStore((state) => state.addToCart);
  const count = useStore((state) => state.cartCount());

  return (
    <main>
      <h1>Product Catalog</h1>
      <p>Fixed user session: QA Demo User</p>
      <Link data-testid="go-cart" to="/cart">
        View cart ({count})
      </Link>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong> - ${product.price}
            <button
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
