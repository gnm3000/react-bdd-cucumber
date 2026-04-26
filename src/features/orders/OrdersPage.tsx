import { Link } from 'react-router-dom';
import { useStore } from '../../state/store';

export function OrdersPage() {
  const orders = useStore((state) => state.orders);

  return (
    <main>
      <h1>Orders</h1>
      <Link to="/">Back to products</Link>
      <ul data-testid="orders-list">
        {orders.length === 0 && <li>No orders yet</li>}
        {orders.map((order) => (
          <li key={order.id}>
            <p>Order #{order.id}</p>
            <p data-testid="order-status">{order.status}</p>
            <p>Total: ${order.total}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
