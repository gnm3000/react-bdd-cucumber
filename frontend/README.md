# Frontend (React + TanStack Query + Cucumber)

Frontend en React que consume los endpoints FastAPI del backend mediante una SDK generada desde OpenAPI y una arquitectura por capas.

## Endpoints consumidos

La SDK encapsula estas operaciones HTTP bajo rutas relativas `/api/*`:

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

El contrato HTTP vive en `openapi/shop.openapi.yaml` y es la fuente de verdad para los endpoints que consume el frontend. Para mantener la integración tipada:

1. Actualiza el contrato OpenAPI cuando cambie el backend.
2. Ejecuta `pnpm run generate:sdk` para regenerar `src/generated/shop-sdk` con el script local `scripts/generate-sdk.mjs`.
3. Consume la API desde datasources en `src/data/datasources`; evita llamar la SDK generada desde componentes, hooks de presentación o casos de uso.
4. Mantén los DTOs y nombres HTTP (`product_id`, etc.) dentro de `data/mappers` y `data/repositories` para que el dominio y la UI trabajen con entidades propias.

## Arquitectura frontend

La dirección de dependencias objetivo es:

```text
app/routes -> presentation -> application -> domain <- data
```

- **app/routes**: shell de la aplicación, providers y configuración de rutas.
- **presentation**: páginas, componentes y hooks orientados a UI. Gestiona React Query/cache y convierte eventos del usuario en llamadas a casos de uso.
- **application**: casos de uso/interactors que orquestan flujos de usuario y coordinan puertos de dominio con servicios de negocio.
- **domain**: entidades, puertos de repositorio y servicios de negocio. No debe importar React, fetch, SDK generada ni detalles HTTP.
- **data**: integración concreta con API, datasources, repositorios y mappers DTO -> dominio.
- **generated/shop-sdk**: código generado desde OpenAPI; se considera detalle de infraestructura y lo consumen los datasources REST.

## Cambios recientes del último PR

El último PR reforzó la arquitectura frontend con estos cambios:

- Se movieron los flujos de usuario a `src/application/use-cases`, por ejemplo agregar al carrito, consultar productos, consultar órdenes y checkout.
- Se añadieron entidades y servicios de dominio para modelar carrito, items, órdenes y reglas como validación de checkout o cálculo de totales.
- Se separaron **datasources REST** (`src/data/datasources`) de **repositorios** (`src/data/repositories`): los datasources conocen la SDK generada; los repositorios implementan puertos del dominio y devuelven entidades.
- Se centralizó la composición de dependencias en `src/presentation/composition/container.ts`.
- Se consolidaron hooks de presentación en `src/presentation/hooks/useShopData.ts`, manteniendo TanStack Query fuera del dominio y de los casos de uso.

## Repositorios vs datasources

- **Repository**: adaptador orientado al dominio. Implementa un puerto (`CartRepository`, `ProductRepository`, `OrderRepository`) y devuelve entidades de dominio.
- **Datasource**: mecanismo concreto de IO. Hoy usa la SDK REST generada, pero podría reemplazarse por GraphQL, localStorage, fixtures o mocks sin cambiar la UI ni los casos de uso.
- **Mapper**: traduce DTOs/API shapes a entidades de dominio y evita que campos como `product_id` se filtren fuera de la capa `data`.

Regla práctica: presentation y application nunca deberían llamar datasources directamente; deben entrar por casos de uso y puertos/repositorios.
