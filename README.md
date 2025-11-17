## ParentTeacherBridge

A monorepo containing a .NET 8 Web API backend and a Next.js 15 TypeScript frontend for a school/parent–teacher management dashboard.

### Project structure

```
Backend/
  Parent_Teacher_WEBAPI.sln
  ParentTeacherBridge.API/
    Controllers/
    Models/
    Services/
    Repositories/
    Data/
    Program.cs
frontend/
  app/ | src/ | lib/ | public/
  package.json (Next.js)
  next.config.mjs
  env.example
```

## Prerequisites

- Node.js 18+ and npm 9+
- .NET SDK 8.0+
- Docker (optional, for containerized backend)

## Environment variables

### Backend (ASP.NET Core)

The API reads the SQL Server connection string from the `CONNECTION_STRING` environment variable if set; otherwise it falls back to the value in `Backend/ParentTeacherBridge.API/appsettings.json`.

- `CONNECTION_STRING`: SQL Server connection string (recommended to set via environment, not in source control)
- `PORT` (optional): Port to bind the API (defaults to 5000). The app listens on `0.0.0.0`.

Swagger is enabled in all environments at `/swagger`.

### Frontend (Next.js)

Create `frontend/.env.local` from `frontend/env.example` and adjust as needed:

- `NEXT_PUBLIC_API_BASE_URL`: Base URL of the API (e.g., `http://localhost:5000`)
- `NEXT_PUBLIC_DEFAULT_STUDENT_ID` (optional)
- `NEXT_PUBLIC_DEFAULT_PARENT_ID` (optional)
- `NEXT_PUBLIC_DEFAULT_THREAD_ID` (optional)

Note: `REACT_APP_*` keys in `env.example` are legacy and can be ignored for the Next.js app. Use the `NEXT_PUBLIC_*` keys.

## Quick start (local development)

### 1) Start the backend (API)

```bash
cd Backend/ParentTeacherBridge.API
dotnet restore
CONNECTION_STRING="<your-sqlserver-connection-string>" dotnet run
# The API will be available at http://localhost:5000 (Swagger at /swagger)
```

### 2) Start the frontend (Next.js)

```bash
cd frontend
cp env.example .env.local  # then edit .env.local as needed
npm install
npm run dev
# Open http://localhost:3000
```

## Docker (backend only)

A multi-stage Dockerfile is provided at the repository root for the backend API.

Build and run:

```bash
# From repository root
docker build -t parentteacherbridge-api .
docker run --rm -p 5000:5000 \
  -e CONNECTION_STRING="<your-sqlserver-connection-string>" \
  --name ptb-api parentteacherbridge-api
# API available at http://localhost:5000 (Swagger at /swagger)
```

## Production builds

### Backend

```bash
cd Backend/ParentTeacherBridge.API
dotnet publish -c Release -o ./out
# Run
CONNECTION_STRING="<your-sqlserver-connection-string>" dotnet ./out/ParentTeacherBridge.API.dll
```

### Frontend

```bash
cd frontend
npm ci
npm run build
npm start  # Next.js production server
```

`next.config.mjs` is configured with `output: 'standalone'` to support server deployment targets.


