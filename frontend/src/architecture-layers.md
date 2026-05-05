# Frontend Layered Architecture

- `presentation/`: React pages/components/hooks only; handles user interaction and display logic only.
- `domain/`: business logic and rules that define how the app works (no UI concerns).
- `data/`: API integration and external state management (fetching and repository implementations).

Dependency direction used in this project:

`presentation -> domain -> data`

- Presentation delegates behavior to domain use cases.
- Domain orchestrates business rules and calls data ports/adapters when external information is needed.
- Data contains HTTP clients, API adapters, and DTO mappers.
