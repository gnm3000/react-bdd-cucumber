import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { AppRoutes } from '../routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </BrowserRouter>
  );
}
