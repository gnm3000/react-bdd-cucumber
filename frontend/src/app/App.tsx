import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { AppRoutes } from '../routes/AppRoutes';
import { container } from './composition/container';
import { ShopDependenciesProvider } from '../presentation/dependencies/ShopDependenciesContext';

export function App() {
  return (
    <ShopDependenciesProvider dependencies={container}>
      <BrowserRouter>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </BrowserRouter>
    </ShopDependenciesProvider>
  );
}
