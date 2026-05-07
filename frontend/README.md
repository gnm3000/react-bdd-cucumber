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
pnpm run generate:sdk
pnpm run dev
pnpm run build
pnpm run test:bdd
pnpm run test:smoke
```

## SDK generada desde OpenAPI

El contrato HTTP vive en `openapi/shop.openapi.yaml` y es la fuente de verdad para
los endpoints que consume el frontend. Para mantener la integración tipada:

1. Actualiza el contrato OpenAPI cuando cambie el backend.
2. Ejecuta `pnpm run generate:sdk` para regenerar `src/generated/shop-sdk` con
   `@hey-api/openapi-ts`.
3. Consume la API exclusivamente desde la SDK generada. Las capas `api` y `data`
   adaptan esa SDK hacia la UI y hacia el dominio; no deberían construir rutas
   HTTP manualmente.


## Arquitectura frontend (dirección de dependencias)

La dirección objetivo en este proyecto es:

`presentation -> domain -> data`

- **presentation**: UI components, interacción de usuario y display logic únicamente.
- **domain**: reglas de negocio y casos de uso que definen cómo funciona la app (sin UI).
- **data**: integración con API y manejo de estado externo/remoto.
