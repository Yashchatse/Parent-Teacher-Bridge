
+### Project Mind Map
+
+```mermaid
+mindmap
+  root((ParentTeacherBridge))
+    Tech Stack
+      Backend: .NET 8 • ASP.NET Core Web API
+      Frontend: Next.js 15 • React 18 • TypeScript • Tailwind CSS
+      Database: SQL Server
+      Tooling: Node.js 18+ • Docker (backend)
+    Backend
+      Solution: Backend/Parent_Teacher_WEBAPI.sln
+      API: Backend/ParentTeacherBridge.API
+        Entry: Program.cs
+        Config: appsettings.json • appsettings.Development.json
+        Swagger: /swagger
+        CORS: AllowFrontend policy (dev)
+        Controllers
+          AdminsController
+          GlobalController
+          LoginController
+          MessageController
+          ParentController
+          TeacherController
+        Data
+          AppDbContext
+          ParentTeacherBridgeAPIContext
+        Models
+        DTOs
+        Repositories
+        Services
+    Frontend
+      App Type: Next.js 15 (TypeScript)
+      Package: frontend/package.json
+      Scripts
+        dev: next dev
+        build: next build
+        start: next start
+      Structure
+        app: globals.css • layout.tsx • page.tsx • teacher/
+        src
+          App.tsx
+          components
+          context: ParentAuthContext.jsx
+          hooks
+          pages
+          parent
+          services
+          teacher
+          lib
+        public: assets (logos, placeholders)
+        styles/tailwind: globals.css • tailwind.config.js
+      Features
+        Login System
+        Dashboard
+        Student Management
+        Teacher Management
+        Class Management
+        Subject Management
+        Timetable Management
+    Configuration
+      Environment Variables
+        Backend: CONNECTION_STRING • PORT
+        Frontend: NEXT_PUBLIC_API_BASE_URL
+      Files
+        frontend/env.example → .env.local
+        next.config.mjs: output 'standalone'
+    Run Locally
+      Backend: dotnet restore && CONNECTION_STRING=... dotnet run (http://localhost:5000)
+      Frontend: npm install && npm run dev (http://localhost:3000)
+    Docker
+      Backend Image: Dockerfile at repo root → exposes 5000
+```
+
+Note: Update nodes as the codebase evolves (e.g., new controllers/services or frontend sections).
+
+
