export class CartItem {
  constructor(
    public readonly productId: string,
    public readonly quantity: number
  ) {
    if (!productId.trim()) throw new Error('Cart item product id is required');
    if (quantity < 1) throw new Error('Cart item quantity must be positive');
  }
}
