import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from 'playwright';

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4173';

const PRODUCTS = [
  { id: '1', name: 'Product A', price: 100 },
  { id: '2', name: 'Product B', price: 200 }
];

interface CartItem {
  product_id: string;
  quantity: number;
}

interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: 'paid';
}

export class PWWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  private cart: CartItem[] = [];
  private orders: Order[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init() {
    this.browser = await chromium.launch();
    this.context = await this.browser.newContext({ baseURL });
    this.page = await this.context.newPage();
    await this.setupApiMocks();
  }

  private async setupApiMocks() {
    // More specific routes must be registered first

    await this.page.route('**/api/cart/items/**', async (route) => {
      if (route.request().method() === 'DELETE') {
        const url = route.request().url();
        const productId = url.split('/').pop();
        this.cart = this.cart.filter((i) => i.product_id !== productId);
        await route.fulfill({ json: this.cart });
      } else {
        await route.continue();
      }
    });

    await this.page.route('**/api/cart/items', async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON() as { product_id: string; quantity: number };
        const existing = this.cart.find((i) => i.product_id === body.product_id);
        if (existing) {
          existing.quantity += body.quantity;
        } else {
          this.cart.push({ product_id: body.product_id, quantity: body.quantity });
        }
        await route.fulfill({ json: this.cart });
      } else {
        await route.continue();
      }
    });

    await this.page.route('**/api/orders/checkout', async (route) => {
      if (route.request().method() === 'POST') {
        const total = this.cart.reduce((sum, item) => {
          const product = PRODUCTS.find((p) => p.id === item.product_id);
          return sum + (product?.price ?? 0) * item.quantity;
        }, 0);
        const order: Order = {
          id: String(this.orders.length + 1),
          user_id: 'user-1',
          items: [...this.cart],
          total,
          status: 'paid'
        };
        this.orders.push(order);
        this.cart = [];
        await route.fulfill({ json: order });
      } else {
        await route.continue();
      }
    });

    await this.page.route('**/api/products', async (route) => {
      await route.fulfill({ json: PRODUCTS });
    });

    await this.page.route('**/api/cart', async (route) => {
      await route.fulfill({ json: this.cart });
    });

    await this.page.route('**/api/orders', async (route) => {
      await route.fulfill({ json: this.orders });
    });
  }

  async cleanup() {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(PWWorld);
