import type { CartItem } from './CartItem';

export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: CartItem[],
    public readonly total: number,
    public readonly status: 'paid'
  ) {
    if (!id.trim()) throw new Error('Order id is required');
    if (!userId.trim()) throw new Error('Order user id is required');
    if (total < 0) throw new Error('Order total cannot be negative');
  }
}
