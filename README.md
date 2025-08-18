# Parent-Teacher Bridge (PTB)

A full-stack application for school administration and parent–teacher engagement.

- Frontend: Next.js 15 (React 18, TypeScript, Tailwind CSS)
- Backend: ASP.NET Core Web API (.NET 8, EF Core, Swagger)
- Database: SQL Server

## Monorepo Structure

```
/workspace
├── Backend/
│   └── ParentTeacherBridge.API/         # .NET 8 Web API
│
└── frontend/                            # Next.js 15 app
    ├── app/                             # App Router
    ├── styles/, public/, src/, lib/
    ├── Dockerfile
    ├── ecosystem.config.cjs             # PM2 config
    └── env.example
```

## Prerequisites

- Node.js >= 18 and npm
- .NET SDK 8.0
- SQL Server instance (local or remote)
- Docker (optional, for containerized runs)

## Quickstart (Local Development)

### 1) Backend API (http://localhost:5000)

- Configure environment variables (recommended):
  - CONNECTION_STRING – SQL Server connection string
  - PORT – optional, defaults to 5000
  - ASPNETCORE_ENVIRONMENT – e.g., Development
  - Jwt__Key, Jwt__Issuer, Jwt__Audience – override JWT settings via env

- Run the API:

```bash
cd Backend/ParentTeacherBridge.API
# Restore and run
dotnet restore
CONNECTION_STRING="<your-sqlserver-connection-string>" dotnet run
# The API listens on 0.0.0.0:PORT (default 5000)
```

- API docs (Swagger):
  - http://localhost:5000/swagger

Notes:
- CORS policy AllowFrontend currently allows any origin. Tighten this for production in Program.cs.
- The API reads CONNECTION_STRING env var first; falls back to appsettings.json connection string if unset.

### 2) Frontend (http://localhost:3000)

```bash
cd frontend
cp env.example .env.local  # adjust values as needed
npm install
npm run dev
```

Key env var:
- NEXT_PUBLIC_API_BASE_URL – e.g., http://localhost:5000

## Scripts

### Frontend
- npm run dev – start Next dev server (port 3000)
- npm run build – build production bundle
- npm start – start production server
- npm run lint – run Next.js lint

### Backend
- dotnet run – run development server
- dotnet build – build
- dotnet publish -c Release -o ./publish – publish artifacts

## Environment Variables

### Backend (.NET)
- CONNECTION_STRING – SQL Server connection string (required for real data)
- PORT – HTTP port to bind (default 5000)
- ASPNETCORE_ENVIRONMENT – Development | Staging | Production
- Jwt__Key – JWT signing key
- Jwt__Issuer – JWT issuer
- Jwt__Audience – JWT audience

These override values in appsettings.json via ASP.NET Core’s env binding.

### Frontend (Next.js)
- NEXT_PUBLIC_API_BASE_URL – Base URL of the API (exposed to browser)
- Optional sample defaults exist in frontend/env.example.

## Docker

### Backend API
A multi-stage Dockerfile is provided at the repo root to containerize the API.

```bash
# From repo root
docker build -t ptb-api -f Dockerfile .
# Run (map to 5000)
docker run --rm -p 5000:5000 \
  -e CONNECTION_STRING="<your-sqlserver-connection-string>" \
  --name ptb-api ptb-api
```

### Frontend
A Dockerfile is provided in frontend/.

```bash
cd frontend
docker build -t ptb-frontend .
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL="http://localhost:5000" \
  --name ptb-frontend ptb-frontend
```

## PM2 (Server/VM) – Frontend

frontend/ecosystem.config.cjs is configured to run the Next.js standalone server via PM2.

```bash
cd frontend
npm ci
npm run build
# Update NEXT_PUBLIC_API_BASE_URL in your environment as needed
pm2 start ecosystem.config.cjs
pm2 status
```

## Production Builds

### Backend
```bash
cd Backend/ParentTeacherBridge.API
dotnet publish -c Release -o ./publish
# Run the dll
CONNECTION_STRING="<your-sqlserver-connection-string>" \
  ASPNETCORE_ENVIRONMENT=Production \
  dotnet ./publish/ParentTeacherBridge.API.dll
```

### Frontend
```bash
cd frontend
npm ci
npm run build
npm start
```

## Database and EF Core

This project uses EF Core for data access. Typical commands:

```bash
# Install EF Core tools if not already
dotnet tool install --global dotnet-ef

# From Backend/ParentTeacherBridge.API
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

Ensure CONNECTION_STRING points to a reachable SQL Server instance with the correct permissions.

## API Surface

Controllers (non-exhaustive): AdminsController, TeacherController, ParentController, LoginController, MessageController, GlobalController.

- Explore endpoints via Swagger at /swagger
- JSON serialization is configured to ignore reference cycles
- SignalR is registered (future real-time features ready)

## Security Notes

- Do not commit real secrets in appsettings.json. Prefer environment variables (CONNECTION_STRING, Jwt__*). If secrets are already committed, rotate them immediately.
- Review and restrict CORS for production.

## Troubleshooting

- Frontend cannot reach API: verify NEXT_PUBLIC_API_BASE_URL and that the API port is accessible.
- Database connectivity issues: verify firewall rules, SQL Server network access, and CONNECTION_STRING format.
- Port conflicts: set PORT (backend) or PORT in PM2 env (frontend) to free ports.

---

Maintainers can expand this README with deployment playbooks, CI/CD instructions, and environment-specific notes.