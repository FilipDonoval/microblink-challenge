FROM python:3.12-slim

WORKDIR /app

RUN pip install uv

COPY pyproject.toml ./

RUN uv pip install --system -r pyproject.toml

COPY . .

EXPOSE 8002

CMD ["gunicorn", "--bind", "0.0.0.0:8002", "--workers", "2", "--timeout", "300", "app:app"]
