# React BDD Cucumber Shop

Proyecto frontend-only con React 18 + Vite + TypeScript, estado local en Zustand y contrato BDD ejecutable con Cucumber + Playwright.

## Stack
- React 18 + TypeScript + Vite
- React Router
- Zustand (estado local + persistencia carrito en localStorage)
- Cucumber (Gherkin) + Playwright + Chai

## Flujo funcional
- Catálogo de productos mock
- Carrito persistente en localStorage
- Checkout lineal con usuario fijo
- Orden creada en memoria como `paid`
- Vista de órdenes en `/orders`

## Scripts
```bash
npm install
npx playwright install chromium
npm run dev
npm run build
npm run test:bdd
npm run test:smoke
```

## Estructura
- `src/` app React
- `features/` contrato Gherkin + steps + world/hooks
- `reports/` documentación viva HTML
- `.github/workflows/ci.yml` pipeline completo de testing BDD

## Nota
No hay backend. Toda la lógica y persistencia es local para demostrar la implementación mínima operativa de BDD como contrato ejecutable.
