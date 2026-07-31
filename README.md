# Civic Companion AI

## Project structure

- `client/` — Next.js frontend application.
- `server/` — FastAPI backend application.
- `spec.md` — product specification.

## Run the client

```powershell
cd client
npm.cmd install
npm.cmd run dev
```

The UI will be available at `http://localhost:3000`.

## Run the server

```powershell
cd server
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API health check is at `http://localhost:8000/health`.

## MVP API capabilities

- `GET /api/services` — all ten supported MVP services.
- `POST /api/plans/generate` — creates a personalized action plan and a saved application record.
- `GET` / `PATCH /api/applications/{id}` — reads or updates application progress.
- `POST /api/chat` — contextual follow-up guidance.
- `POST /api/emergency` — guidance for lost documents, rejections, incorrect applications, and renewals.

Open `http://localhost:8000/docs` for the interactive API documentation.

## Production integrations still required

This repository is a functioning local MVP. Before public use, replace the demo
guidance with verified official service data, configure authentication and a
database service, add a maps provider, and configure an LLM provider with a
server-side API key. Do not use the MVP's office, fee, or timing guidance as an
official source.
