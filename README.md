# NDEL Playground

A simple web playground for the [NDEL library](https://github.com/tom-mcmillan/ndel). Paste Python or SQL pipeline code and see a rendered NDEL description (datasets, transformations, features, models, metrics). All analysis is static—no code is executed.

## Architecture

- **Frontend (Next.js)**: single page with code input and NDEL output.
- **Backend (Python + Flask)**: `/describe` endpoint calling NDEL APIs (`describe_python_source`, `describe_sql_source`).

## Getting Started

### 1) Install Python dependencies

```bash
pip install -r requirements.txt
```

This pulls Flask, Flask-CORS, and the `ndel` library from GitHub.

### 2) Start the Python backend

```bash
python api_server.py
```

Runs at `http://localhost:5000/describe` and expects JSON:

```json
{ "source": "...python or sql...", "language": "python" }
```

### 3) Start the Next.js frontend

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and paste code to see NDEL output.

## How It Works

1. Paste Python or SQL pipeline code.
2. Choose the language (Python/SQL) and click **Describe**.
3. The frontend calls `/api/generate`, which proxies to Flask `/describe`.
4. Flask uses NDEL to render a descriptive DSL.
5. Output shows datasets, transformations (with lineage), features, models, and metrics.

## Environment Variables

Create `.env.local` to point the frontend to your backend:

```bash
PYTHON_API_URL=http://localhost:5000
```

## Development Pointers

- Frontend: `app/page.tsx`
- API proxy: `app/api/generate/route.ts`
- Backend: `api_server.py`

Refer to the main NDEL repo for full docs, config, lineage, and diff/validation helpers.
