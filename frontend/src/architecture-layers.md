# Frontend Layered Architecture

This frontend follows the layers shown in the architecture diagram and adds an explicit application/use-case layer between view logic and domain services:

- `presentation/`: React pages/components and UI-facing hooks. It renders data and adapts user interactions into use-case calls.
- `application/`: use cases/interactors. Each class represents a user flow and orchestrates repositories plus domain services.
- `domain/`: entities, repository ports, and services. It owns business rules without React, fetch, or generated API types.
- `data/`: generated SDK adapters, repository implementations, and DTO mappers. It hides API payload details from the rest of the app.
- `app/` and `routes/`: application shell, routing, and app-level providers.

Dependency direction used in this project:

`app/routes -> presentation -> application -> domain <- data`

- Presentation hooks call use cases and manage React Query cache/view state.
- Use cases model complete user flows, for example adding a product to the cart validates the product through a repository and delegates business rules to `CartService`.
- Domain services and entities contain reusable business behavior such as cart checkout validation, item counts, and totals.
- Data implements domain ports and maps API DTOs into domain entities.
- API field names, such as `product_id`, stay inside data mappers/repositories and do not leak into UI components.

When adding a feature, prefer this split:

1. Put reusable business rules in `domain/entities` or `domain/services`.
2. Put the user flow orchestration in `application/use-cases`.
3. Convert API shapes in `data/mappers` and implement ports in `data/repositories`.
4. Expose UI-friendly hooks from `presentation/hooks` and keep components focused on rendering/events.
