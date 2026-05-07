FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml ./
RUN python - <<'PY'
import subprocess
import sys
import tomllib
from pathlib import Path

with Path('pyproject.toml').open('rb') as pyproject:
    dependencies = tomllib.load(pyproject)['project']['dependencies']

subprocess.check_call([
    sys.executable,
    '-m',
    'pip',
    'install',
    '--no-cache-dir',
    *dependencies,
])
PY

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
