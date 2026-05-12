import { Navigate, Route, Routes } from 'react-router-dom';
import { CartPage } from '../presentation/pages/CartPage';
import { CheckoutPage } from '../presentation/pages/CheckoutPage';
import { OrdersPage } from '../presentation/pages/OrdersPage';
import { ProductListPage } from '../presentation/pages/ProductListPage';

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
