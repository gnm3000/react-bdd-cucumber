export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number
  ) {
    if (!id.trim()) throw new Error('Product id is required');
    if (!name.trim()) throw new Error('Product name is required');
    if (price < 0) throw new Error('Product price cannot be negative');
  }
}
