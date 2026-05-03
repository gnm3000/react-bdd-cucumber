# React + FastAPI BDD Shop

Monorepo con dos carpetas principales:

- `frontend/`: React + TanStack Query + Cucumber/Playwright.
- `backend/`: FastAPI con Clean Architecture + BDD con pytest-bdd.

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e .[test]
uvicorn app.main:app --reload --port 8000
pytest
```

## Frontend

```bash
cd frontend
pnpm install
pnpm dev
pnpm test:bdd
```

El frontend consume `GET/POST/DELETE` en `/api/*` vía proxy de Vite hacia `http://127.0.0.1:8000`.
