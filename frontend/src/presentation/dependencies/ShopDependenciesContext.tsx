import { createContext, useContext, type ReactNode } from 'react';
import type { AddToCartUseCase } from '../../application/use-cases/AddToCartUseCase';
import type { CheckoutUseCase } from '../../application/use-cases/CheckoutUseCase';
import type { GetCartUseCase } from '../../application/use-cases/GetCartUseCase';
import type { GetOrdersUseCase } from '../../application/use-cases/GetOrdersUseCase';
import type { GetProductsUseCase } from '../../application/use-cases/GetProductsUseCase';
import type { RemoveFromCartUseCase } from '../../application/use-cases/RemoveFromCartUseCase';

export interface ShopDependencies {
  getProductsUseCase: GetProductsUseCase;
  getCartUseCase: GetCartUseCase;
  addToCartUseCase: AddToCartUseCase;
  removeFromCartUseCase: RemoveFromCartUseCase;
  getOrdersUseCase: GetOrdersUseCase;
  checkoutUseCase: CheckoutUseCase;
}

const ShopDependenciesContext = createContext<ShopDependencies | null>(null);

interface ShopDependenciesProviderProps {
  children: ReactNode;
  dependencies: ShopDependencies;
}

export function ShopDependenciesProvider({ children, dependencies }: ShopDependenciesProviderProps) {
  return <ShopDependenciesContext.Provider value={dependencies}>{children}</ShopDependenciesContext.Provider>;
}

export function useShopDependencies(): ShopDependencies {
  const dependencies = useContext(ShopDependenciesContext);

  if (!dependencies) throw new Error('ShopDependenciesProvider is required to use shop data hooks');

  return dependencies;
}
