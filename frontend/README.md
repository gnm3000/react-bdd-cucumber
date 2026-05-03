# Frontend (React + TanStack Query + Cucumber)

Frontend en React que consume los endpoints FastAPI del backend:

- `GET /api/products`
- `GET /api/cart`
- `POST /api/cart/items`
- `DELETE /api/cart/items/{product_id}`
- `POST /api/orders/checkout`
- `GET /api/orders`

## Scripts

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run test:bdd
pnpm run test:smoke
```
