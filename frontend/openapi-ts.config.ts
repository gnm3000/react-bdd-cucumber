import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './openapi/shop.openapi.yaml',
  output: {
    path: './src/generated/shop-sdk',
    clean: true,
    indexFile: true
  },
  plugins: [
    '@hey-api/typescript',
    {
      name: '@hey-api/sdk',
      asClass: false
    }
  ]
});
