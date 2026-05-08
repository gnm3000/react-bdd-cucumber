// This file is generated from openapi/shop.openapi.yaml.
// Regenerate with `pnpm run generate:sdk` after changing the OpenAPI contract.

export type Product = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = {
  product_id: string;
  quantity: number;
};

export type AddCartItemRequest = {
  product_id: string;
  quantity: number;
};

export type Order = {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: 'paid';
};
