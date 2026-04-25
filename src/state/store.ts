import { create } from 'zustand';
import { products } from '../mocks/products';
import { mockUser } from '../mocks/user';
import type { CartItem } from '../types/cart';
import type { Order } from '../types/order';
import type { Product } from '../types/product';

const CART_STORAGE_KEY = 'bdd-shop-cart';
const ORDERS_STORAGE_KEY = 'bdd-shop-orders';

const loadCart = (): CartItem[] => {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const loadOrders = (): Order[] => {
  const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistCart = (cart: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

const persistOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

const computeTotal = (cart: CartItem[], productCatalog: Product[]) =>
  cart.reduce((acc, item) => {
    const product = productCatalog.find((p) => p.id === item.productId);
    return acc + (product ? product.price * item.quantity : 0);
  }, 0);

interface ShopState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkout: () => Order | null;
  cartCount: () => number;
  cartTotal: () => number;
  hydrateCartForTests: (items: CartItem[]) => void;
}

export const useStore = create<ShopState>((set, get) => ({
  products,
  cart: loadCart(),
  orders: loadOrders(),
  addToCart: (productId: string) => {
    const cart = [...get().cart];
    const item = cart.find((i) => i.productId === productId);

    if (item) {
      item.quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }

    persistCart(cart);
    set({ cart });
  },
  removeFromCart: (productId: string) => {
    const cart = get().cart
      .map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    persistCart(cart);
    set({ cart });
  },
  clearCart: () => {
    persistCart([]);
    set({ cart: [] });
  },
  checkout: () => {
    const cart = get().cart;
    if (!cart.length) return null;

    const total = computeTotal(cart, get().products);
    const order: Order = {
      id: crypto.randomUUID(),
      userId: mockUser.id,
      items: cart,
      total,
      status: 'paid'
    };

    persistCart([]);
    const orders = [...get().orders, order];
    persistOrders(orders);
    set({ orders, cart: [] });
    return order;
  },
  cartCount: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),
  cartTotal: () => computeTotal(get().cart, get().products),
  hydrateCartForTests: (items: CartItem[]) => {
    persistCart(items);
    set({ cart: items });
  }
}));
