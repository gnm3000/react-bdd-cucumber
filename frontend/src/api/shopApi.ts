import {
  addCartItem,
  checkout,
  getCart,
  getOrders,
  getProducts,
  removeCartItem
} from '../generated/shop-sdk';

export const shopApi = {
  getProducts,
  getCart,
  addToCart: (productId: string) => addCartItem({ product_id: productId, quantity: 1 }),
  removeFromCart: removeCartItem,
  checkout,
  getOrders
};
