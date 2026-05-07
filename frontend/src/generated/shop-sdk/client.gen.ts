// This file mirrors a generated fetch client for openapi/shop.openapi.yaml.
// Regenerate with `pnpm run generate:sdk` after changing the OpenAPI contract.

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

type ShopSdkConfig = {
  baseUrl: string;
};

const config: ShopSdkConfig = {
  baseUrl: '/api'
};

export function configureShopSdk(nextConfig: Partial<ShopSdkConfig>) {
  Object.assign(config, nextConfig);
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...requestOptions } = options;
  const response = await fetch(`${config.baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    ...requestOptions
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
