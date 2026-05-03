import { useOrders } from '../../hooks/useShopData';
import type { Order } from '../../types/order';

export function OrdersPage() {
  const { data: orders = [] } = useOrders();

  return (
    <main className="space-y-6">
      <ul className="grid gap-4" data-testid="orders-list">
        {orders.length === 0 && <li>No orders yet</li>}
        {orders.map((order: Order) => (
          <li key={order.id}>
            <p>Total: ${order.total}</p>
            <p data-testid="order-status">{order.status}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
