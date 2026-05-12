# Frontend Layered Architecture

This frontend follows the layers shown in the architecture diagram and adds an explicit application/use-case layer between view logic and domain services:

- `presentation/`: React pages/components, UI-facing hooks, and presentation dependency context. It renders data and adapts user interactions into use-case calls.
- `application/`: use cases/interactors. Each class represents a user flow and orchestrates repositories plus domain services.
- `domain/`: entities, repository ports, and services. It owns business rules without React, fetch, or generated API types.
- `data/`: datasources, repository implementations, and DTO mappers. Datasources own concrete IO (REST SDK today, GraphQL/localStorage tomorrow), while repositories adapt raw payloads into domain entities.
- `app/`: application shell, app-level providers, and the composition root that wires concrete repositories/services/use cases.
- `routes/`: route declarations that point to presentation pages.

Dependency direction used in this project:

`app/routes -> presentation -> application -> domain <- data`

The composition root is the only place where concrete implementations are wired together:

`app/composition -> data + application + domain`

- Presentation pages/components stay focused on rendering and events.
- Presentation hooks call use cases and manage React Query cache/view state.
- Presentation dependency context receives app-wired use cases, so presentation does not import data repositories or datasources.
- Use cases model complete user flows, for example adding a product to the cart validates the product through a repository and delegates business rules to `CartService`.
- Domain services and entities contain reusable business behavior such as cart checkout validation, item counts, and totals.
- Data repositories implement domain ports, call datasources, and map API DTOs into domain entities.
- API field names, such as `product_id`, stay inside data mappers/repositories and do not leak into UI components.

When adding a feature, prefer this split:

1. Put reusable business rules in `domain/entities` or `domain/services`.
2. Put the user flow orchestration in `application/use-cases`.
3. Put concrete IO in `data/datasources`, convert API shapes in `data/mappers`, and implement domain ports in `data/repositories`.
4. Wire concrete implementations in `app/composition`.
5. Expose UI-friendly hooks from `presentation/hooks` and keep components focused on rendering/events in `presentation/pages`.


## Repository vs datasource

- Repository: domain-facing adapter that implements a port and returns domain entities.
- Datasource: concrete IO mechanism such as the generated REST SDK, GraphQL, `fetch`, or localStorage.

Presentation and application code should never call datasources directly; they go through use cases and repositories so changing REST to GraphQL only affects the data layer.

## Architecture check

Run `pnpm check:architecture` from `frontend/` before adding new cross-layer imports. The check fails if:

- `domain/` imports React, app, presentation, application, data, or generated SDK code.
- `application/` imports React, app, presentation, data, or generated SDK code.
- `presentation/` imports app, routes, data, or generated SDK code.
- `data/` imports React, app, routes, presentation, or application code.
