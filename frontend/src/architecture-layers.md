# Frontend Layered Architecture

- `presentation/`: React pages/components/hooks only.
- `domain/`: entities, use cases, ports (framework agnostic).
- `data/`: API clients, mappers, repository implementations.

Dependency direction is enforced as:

`presentation -> domain <- data`

- UI never imports concrete data repositories directly.
- Domain contains no React, HTTP clients, or external library types.
- DTOs are transformed by mappers before entering domain.
