import { Navigate, Route, Routes } from 'react-router-dom';
import { CartPage } from '../features/cart/CartPage';
import { CheckoutPage } from '../features/checkout/CheckoutPage';
import { OrdersPage } from '../features/orders/OrdersPage';
import { ProductListPage } from '../features/products/ProductListPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProductListPage />} path="/" />
      <Route element={<CartPage />} path="/cart" />
      <Route element={<CheckoutPage />} path="/checkout" />
      <Route element={<OrdersPage />} path="/orders" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
