import { useQuery } from '@tanstack/react-query';
import { container } from '../composition/container';

export function useProductsQuery() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => container.getProductsUseCase.execute()
  });
}
