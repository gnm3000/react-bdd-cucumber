import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const contractPath = resolve(projectRoot, 'openapi/shop.openapi.yaml');
const outputDir = resolve(projectRoot, 'src/generated/shop-sdk');

const contract = await readFile(contractPath, 'utf8');
const requiredOperations = [
  'getProducts',
  'getCart',
  'addCartItem',
  'removeCartItem',
  'checkout',
  'getOrders'
];

for (const operationId of requiredOperations) {
  if (!contract.includes(`operationId: ${operationId}`)) {
    throw new Error(`OpenAPI contract is missing operationId: ${operationId}`);
  }
}

await mkdir(outputDir, { recursive: true });

const files = {
  'types.gen.ts': `// This file is generated from openapi/shop.openapi.yaml.\n// Regenerate with \`pnpm run generate:sdk\` after changing the OpenAPI contract.\n\nexport type Product = {\n  id: string;\n  name: string;\n  price: number;\n};\n\nexport type CartItem = {\n  product_id: string;\n  quantity: number;\n};\n\nexport type AddCartItemRequest = {\n  product_id: string;\n  quantity: number;\n};\n\nexport type Order = {\n  id: string;\n  user_id: string;\n  items: CartItem[];\n  total: number;\n  status: 'paid';\n};\n`,
  'client.gen.ts': `// This file is generated from openapi/shop.openapi.yaml.\n// Regenerate with \`pnpm run generate:sdk\` after changing the OpenAPI contract.\n\ntype RequestOptions = Omit<RequestInit, 'body'> & {\n  body?: unknown;\n};\n\ntype ShopSdkConfig = {\n  baseUrl: string;\n};\n\nconst config: ShopSdkConfig = {\n  baseUrl: '/api'\n};\n\nexport function configureShopSdk(nextConfig: Partial<ShopSdkConfig>) {\n  Object.assign(config, nextConfig);\n}\n\nexport async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {\n  const { body, headers, ...requestOptions } = options;\n  const response = await fetch(\`${'${config.baseUrl}'}${'${path}'}\`, {\n    headers: {\n      'Content-Type': 'application/json',\n      ...headers\n    },\n    body: body === undefined ? undefined : JSON.stringify(body),\n    ...requestOptions\n  });\n\n  if (!response.ok) {\n    throw new Error(\`API error: ${'${response.status}'}\`);\n  }\n\n  return response.json() as Promise<T>;\n}\n`,
  'sdk.gen.ts': `// This file is generated from openapi/shop.openapi.yaml.\n// Regenerate with \`pnpm run generate:sdk\` after changing the OpenAPI contract.\n\nimport { request } from './client.gen';\nimport type { AddCartItemRequest, CartItem, Order, Product } from './types.gen';\n\nexport function getProducts() {\n  return request<Product[]>('/products');\n}\n\nexport function getCart() {\n  return request<CartItem[]>('/cart');\n}\n\nexport function addCartItem(body: AddCartItemRequest) {\n  return request<CartItem[]>('/cart/items', {\n    method: 'POST',\n    body\n  });\n}\n\nexport function removeCartItem(productId: string) {\n  return request<CartItem[]>(\`/cart/items/${'${productId}'}\`, {\n    method: 'DELETE'\n  });\n}\n\nexport function checkout() {\n  return request<Order | null>('/orders/checkout', {\n    method: 'POST'\n  });\n}\n\nexport function getOrders() {\n  return request<Order[]>('/orders');\n}\n`,
  'index.ts': `export * from './client.gen';\nexport * from './sdk.gen';\nexport * from './types.gen';\n`
};

await Promise.all(
  Object.entries(files).map(([fileName, content]) =>
    writeFile(resolve(outputDir, fileName), content)
  )
);

console.log(`Generated ${Object.keys(files).length} SDK files in ${outputDir}`);
