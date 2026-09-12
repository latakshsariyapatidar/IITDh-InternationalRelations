# IIT Dharwad — International Relations Office (IRO) Web Platform
## Production & Maintenance Documentation

Welcome to the technical documentation for the **IIT Dharwad International Relations Office (IRO)** official web portal and management system. This platform manages international student admissions, outbound and inbound exchange programs, bilateral agreements & Memorandums of Understanding (MOUs), global opportunities, visiting delegations, and administrative workflows.

---

## 📚 Documentation Index

| Document | Description |
| :--- | :--- |
| **[Architecture & System Design](./ARCHITECTURE.md)** | Deep-dive into backend architecture, database schema, authentication & session security, and public vs. private file pipelines. |
| **[Feature Breakdown & Functionality](./FEATURES.md)** | Detailed specification of all portal modules (Public pages, Admin panel, Faculty portal, Student application tracking). |
| **[Production Deployment Guide](./DEPLOYMENT.md)** | Zero-downtime deployment instructions with Docker Compose, SSL/TLS reverse proxy, environment setup, and database backups. |
| **[Troubleshooting & Operations Runbook](./TROUBLESHOOTING.md)** | Step-by-step diagnostic guide for incidents, error recovery, common pitfalls, and system maintenance. |

---

## 🛠️ Technology Stack Overview

### Frontend Architecture
- **Framework**: React 19 + Vite (Single Page Application)
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens (IIT Dharwad brand palette: Royal Purple `#5e1c64`, Marigold `#ef9f27`, Soft Lavender `#e7d1e9`, Canvas `#ffffff`)
- **Icons**: `@remixicon/react`
- **Routing**: React Router v7 with dynamic tab title management and automated scroll restoration
- **HTTP Client**: Axios with centralized request/response interceptors, automated token refresh, and cache-busting
- **Production Server**: Nginx Alpine with gzip compression, 50MB request payload support, aggressive static asset caching, and security headers

### Backend Architecture
- **Runtime**: Node.js 20+ (ES Modules)
- **API Framework**: Express.js with TypeScript
- **ORM & Database**: Prisma ORM with PostgreSQL 15
- **Security Middleware**:
  - `helmet` (Strict Content Security, Cross-Origin Resource Policy for media)
  - `cors` (Restricted credentialed cross-origin access)
  - `express-rate-limit` (Tiered IP-based rate limiting with reverse-proxy trust)
  - `cookie-parser` (HttpOnly, SameSite, Secure refresh cookies)
  - `bcrypt` (Password hashing)
  - `jsonwebtoken` (Stateless short-lived access tokens)
  - `google-auth-library` (Domain-restricted Google OAuth for `@iitdh.ac.in`)
- **Background Tasks**: `node-cron` automated daily sweeps for expiring visas, passports, and bilateral agreements
- **File Uploads**: `multer` with file-type validation (JPEG, PNG, WEBP, GIF, PDF) and separation into public vs. private document storage
- **Reporting**: `exceljs` with signed tamper-proof document links

---

## 📂 Repository Directory Layout

```
IRO/
├── docker-compose.yml           # Production Docker Compose definition
├── .env.production.example      # Production environment variable template
├── backend/                     # Express + TypeScript API Server
│   ├── Dockerfile               # Production Dockerfile
│   ├── entrypoint.sh            # Container bootstrapper (migration & seed runner)
│   ├── prisma/                  # Database schema & migration history
│   │   ├── schema.prisma        # Complete relational schema
│   │   └── migrations/          # Linear SQL migration ledger
│   └── src/
│       ├── server.ts            # Entrypoint & cron initializer
│       ├── app.ts               # Express configuration & route binding
│       ├── config/              # Validated environment & Prisma client config
│       ├── shared/              # Reusable middleware, error classes & utilities
│       └── modules/             # Domain modules (auth, partner, mou, student, etc.)
├── frontend/                    # Vite + React Client
│   ├── Dockerfile               # Multi-stage production build (Node -> Nginx)
│   ├── nginx.conf               # Nginx reverse proxy, caching & security rules
│   ├── vite.config.js           # Vite build & local dev server proxy
│   └── src/
│       ├── api/                 # Axios client with interceptors
│       ├── components/          # Reusable UI components (Navbar, Footer, Modals)
│       ├── pages/               # Public routes (Home, Opportunities, Partners, etc.)
│       └── pages/admin/         # Admin management dashboards
└── documentation/               # System documentation & maintenance runbooks
```

---

## ⚡ Quick Start for Development

```bash
# 1. Backend Setup
cd backend
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run seed
npm run dev

# 2. Frontend Setup (in a separate terminal)
cd ../frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173` and automatically proxy API calls to the backend running on `http://localhost:3000`.
