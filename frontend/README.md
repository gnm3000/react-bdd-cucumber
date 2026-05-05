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


## Arquitectura frontend (dirección de dependencias)

La dirección objetivo en este proyecto es:

`presentation -> domain -> data`

- **presentation**: UI components, interacción de usuario y display logic únicamente.
- **domain**: reglas de negocio y casos de uso que definen cómo funciona la app (sin UI).
- **data**: integración con API y manejo de estado externo/remoto.
