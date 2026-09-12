# Architecture & System Design

This document details the architectural decisions, database modeling, security enforcement, and internal pipelines of the IIT Dharwad International Relations Office platform.

---

## 1. High-Level Architecture Diagram

```
                 Internet / Campus Users
                           │
                           ▼
          ┌───────────────────────────────────┐
          │      Nginx Reverse Proxy          │
          │   (Gzip, Cache, SSL, 50MB Body)   │
          └─────────────────┬─────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │ /assets/*                 │ /api/* & /uploads/*
              ▼                           ▼
    ┌───────────────────┐       ┌───────────────────────┐
    │ React Frontend    │       │ Express Backend (API) │
    │ Static SPA Assets │       │ Node.js 20 + TS       │
    └───────────────────┘       └───────────┬───────────┘
                                            │
                                ┌───────────┴───────────┐
                                ▼                       ▼
                      ┌──────────────────┐    ┌───────────────────┐
                      │  PostgreSQL 15   │    │ Persistent Disk   │
                      │  (Relational DB) │    │ /uploads (public) │
                      │                  │    │ /private-uploads  │
                      └──────────────────┘    └───────────────────┘
```

---

## 2. Authentication & Authorization Model

The application utilizes a multi-tiered identity and access management system:

### A. Administrative Authentication (`/api/v1/auth`)
- **Credentials**: Email + Password stored using `bcrypt` (work factor: 10).
- **Session Tokens**:
  - **Access Token**: Short-lived JSON Web Token (15 minutes). Sent in `Authorization: Bearer <token>` header.
  - **Refresh Token**: Long-lived cryptographic token (7 days) stored as an `HttpOnly`, `SameSite=Lax`, `Secure` cookie.
- **Automated Token Refresh**: The frontend Axios client automatically intercepts `401 Unauthorized` responses and fires `/api/v1/auth/refresh` to restore session continuity transparently.

### B. Student & Faculty Authentication (`/api/v1/student-auth`)
- **Mechanism**: Google OAuth 2.0 Identity verification via Google ID tokens.
- **Domain Restriction**: Strictly limited to verified `@iitdh.ac.in` domain accounts using Google's token payload `hd: "iitdh.ac.in"`.
- **Role Assignment**:
  - If the email address exists in the `Faculty` directory, the session is elevated to **Faculty** role, granting access to the Faculty Opportunities Portal.
  - Otherwise, the user is authenticated as an **IITDh Student**, granting access to Inbound/Outbound application tracking.

### C. Role Matrix

| Resource / Endpoint | Public | Student | Faculty | Admin |
| :--- | :---: | :---: | :---: | :---: |
| Public Website & Opportunities | ✅ | ✅ | ✅ | ✅ |
| Submit Degree / Exchange Application | ✅ | ✅ | ✅ | ✅ |
| Track Personal Application | ❌ | ✅ | ❌ | ✅ |
| Create Research / Exchange Opportunity | ❌ | ❌ | ✅ | ✅ |
| View / Download Signed MOU PDF | ❌ | ✅ | ✅ | ✅ |
| Admin Dashboard (Full CRUD & Exports) | ❌ | ❌ | ❌ | ✅ |

---

## 3. Database Schema Overview (Prisma ORM)

All models are defined in [backend/prisma/schema.prisma](file:///c:/Users/latak/Documents/CODE/IRO/backend/prisma/schema.prisma):

- **`User`**: Admin user accounts with credentials and activity timestamps.
- **`Partner`**: Overseas universities, research institutes, and consortia. Stores country codes, websites, logos, and assigned IITDh champion faculty.
- **`Mou`**: Bilateral agreements linked to a partner. Stores execution dates, validity periods, status (`ACTIVE`, `EXPIRED`, `PENDING`), and references to signed PDF documents.
- **`Opportunity`**: Fellowships, exchange programs, internships, and research openings categorized by type and audience (`STUDENTS`, `FACULTY`, `BOTH`).
- **`InboundExchangeApplication`**: Applications from international students visiting IIT Dharwad.
- **`OutboundApplication`**: Applications from IIT Dharwad students seeking overseas mobility.
- **`DegreeAdmissionApplication`**: International students applying for full-time degree programs.
- **`Faculty`**: Directory of IIT Dharwad professors serving as academic champions or opportunity hosts.
- **`Notification`**: Audit logs and automated expiry warnings (flagging upcoming visa expirations, student departures, and MOU renewals).
- **`Event`, `Gallery`, `Testimonial`, `Download`, `FAQ`, `Visitor`**: Auxiliary content collections.

---

## 4. File Storage Architecture: Public vs. Private

Security demands strict separation between public assets and sensitive institutional files:

### Public Storage (`/app/uploads/`)
- **Files**: University logos, event banners, campus photos, brochure PDFs, testimonials.
- **Access**: Direct HTTP GET via `/uploads/*` served by Express static middleware.
- **Validation**: Strict mime-type verification (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`) and 5MB size limit.

### Private Storage (`/app/private-uploads/`)
- **Files**: Signed bilateral MOU agreements, applicant passports, transcripts, recommendation letters.
- **Access**: Strictly blocked from public static web access.
- **Delivery**:
  - **Authenticated Download**: Endpoints such as `/api/v1/mous/:id/document` verify an active `@iitdh.ac.in` student, faculty, or admin session before streaming the file.
  - **Signed Spreadsheet Links**: When admins export application reports to Excel, embedded file links are generated with an HMAC-SHA256 signature and expiration timestamp (`/api/v1/applications/signed-download?token=...`).

---

## 5. Security & Hardening Policies

1. **Reverse Proxy Trust (`TRUST_PROXY`)**:
   When deployed behind Nginx, `TRUST_PROXY=1` ensures Express derives the true client IP from `X-Forwarded-For`, preventing IP spoofing while ensuring accurate rate limiting.
2. **Strict Rate Limiting**:
   - General API: 1,000 requests per 15 minutes.
   - Authentication Endpoints: 5 attempts per 15 minutes to block brute-force attempts.
   - Public Submission Forms: 10 submissions per hour to prevent spam.
3. **HTTP Security Headers (`helmet`)**:
   - `Cross-Origin-Resource-Policy: cross-origin` allows the frontend client to embed media smoothly.
   - `Cross-Origin-Opener-Policy: same-origin-allow-popups` allows Google Sign-In popups to communicate without browser interruption.
4. **SQL Injection & Data Integrity**:
   100% of database queries are executed via Prisma's parameterized prepared statements. No raw unescaped SQL is executed anywhere in the codebase.
