# Worker Service

Background job microservice for marketplace sync, publish retries, and scheduled tasks.

## Responsibilities

- enqueue background jobs for listing sync, promotion sync, publish retries, and inventory sync
- advance job status: `queued → running → completed`
- retry failed jobs within a configurable max attempt limit
- expose job status for gateway polling and operator dashboards

## Run locally

From `services/worker_service/`:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
uvicorn app.main:app --reload --port 8005
pytest
```

## Docker

From repository root:

```bash
docker compose up --build worker_service
```

API docs: `http://127.0.0.1:8005/docs`

Host and container both use port `8005`.

## Skills

- Job enqueue and status polling
- Mock sync execution for listing and promotion workflows
- Publish retry handling
- Inventory sync scheduling

## Documentation

- `docs/SETUP.md` — install, env vars, curl examples
- `../../docs/ARCHITECTURE.md` — system architecture

## Routes

- `GET /health`
- `GET /api/v1/marketplaces`
- `GET /api/v1/jobs`
- `POST /api/v1/jobs`
- `GET /api/v1/jobs/{job_id}`
- `GET /api/v1/jobs/{job_id}/status`
- `POST /api/v1/jobs/{job_id}/run`
- `POST /api/v1/jobs/{job_id}/retry`

## Future

- Celery workers with Redis broker
- Scheduled cron jobs for marketplace polling
- Integration with listing and promotion services
