# IRO Backend API Documentation

International Relations Office — IIT Dharwad. Base URL in development: `http://localhost:3000/api/v1` (health check lives at `http://localhost:3000/api`, no `/v1`). In production this is proxied on the same domain as the frontend under `/api/` (see deployment notes) — coordinate the actual production origin with whoever owns the backend deploy.

> **Read the "Frontend Integration Checklist" section near the bottom first.** It lists every gotcha that has actually broken integrations during this project's build — skipping it will cost you real debugging time.

---

## Table of Contents

- [Response Envelope](#response-envelope)
- [Error Format](#error-format)
- [Authentication — Two Independent Systems](#authentication--two-independent-systems)
  - [Admin Auth](#admin-auth)
  - [Student Auth (Google Sign-In)](#student-auth-google-sign-in)
- [HTTP Caching on Public GET Endpoints](#http-caching-on-public-get-endpoints)
- [File Uploads](#file-uploads)
  - [Public uploads (images/documents for admin-managed content)](#public-uploads)
  - [Private uploads (applicant documents)](#private-uploads)
- [Resource Modules (CRUD)](#resource-modules-crud)
- [Site Content (Admin-Editable Text/Stats/Images)](#site-content)
- [Page Aggregation Endpoints](#page-aggregation-endpoints)
- [Student Applications (Inbound, Foreign National Admissions)](#student-applications-inbound)
- [Outbound Exchange Applications (IITDH Students)](#outbound-exchange-applications)
- [MOU Tracking](#mou-tracking)
- [Dashboard Stats](#dashboard-stats)
- [Full Endpoint Reference Table](#full-endpoint-reference-table)
- [Frontend Integration Checklist](#frontend-integration-checklist)

---

## Response Envelope

Every response — success or failure — is JSON in one shape:

```json
{
  "success": true,
  "status": "success",
  "message": "Announcements fetched",
  "data": { "announcements": [...], "total": 12, "page": 1, "limit": 10 }
}
```

- `success`: `true`/`false`.
- `status`: `"success"` | `"fail"` (4xx, your request was wrong) | `"error"` (5xx, server's fault).
- `data`: the payload, or `null` for actions with nothing to return (e.g. "logged out").

## Error Format

```json
{
  "success": false,
  "status": "fail",
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email format" }]
}
```

`errors` is only present on validation failures (400s from Zod). In development, responses also include a `stack` field — **never rely on it, it is absent in production.**

| Status | Meaning |
|---|---|
| 400 | Validation failed, or a referenced resource (e.g. `partnerId`) doesn't exist |
| 401 | Missing/invalid/expired token, or wrong token type (admin token on a student route, etc.) |
| 403 | Valid credentials, but not allowed here (e.g. non-`iitdh.ac.in` Google account) |
| 404 | Resource or route not found |
| 409 | Unique constraint violated (duplicate email, etc.) |
| 429 | Rate limited (only on the public inbound-application submission endpoint) |
| 500 | Unexpected server error — message is always generic in production |

---

## Authentication — Two Independent Systems

**There are two completely separate login systems that can be active in the same browser at once.** Never share token storage, refresh logic, or cookie names between them.

| | Admin | Student |
|---|---|---|
| Who | The handful of IRO office staff | Any current IITDH student |
| How they log in | Email + password | Google Sign-In, restricted to `@iitdh.ac.in` |
| Access token lifetime | 15 min | 15 min |
| Refresh cookie name | `refreshToken` | `studentRefreshToken` |
| Refresh cookie lifetime | 7 days | 7 days |
| JWT `role` claim | `"admin"` | `"student"` |
| Used for | All admin-dashboard CRUD | Outbound exchange applications only |

A token from one system is **cryptographically rejected** on the other's routes (both are signed with the same server secret, but each middleware checks the `role` claim explicitly) — don't build any "maybe this token works here too" logic.

### Admin Auth

Base path: `/api/v1/auth`

**Login**
```
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "admin@iitdh.ac.in", "password": "..." }
```
Response: `{ "data": { "accessToken": "eyJ..." } }`, and sets the `refreshToken` httpOnly cookie automatically. Store `accessToken` in memory (a JS variable / React state / Zustand store) — **never in `localStorage`** (defeats the purpose of httpOnly refresh cookies if the access token is exfiltratable via XSS anyway, but still, don't).

**Every protected admin request needs:**
```
Authorization: Bearer <accessToken>
```
plus `credentials: "include"` on the fetch/axios call if you ever also need the cookie sent (refresh/logout do).

**Refresh** (call when a request 401s with an expired token, or proactively before the 15-min mark)
```
POST /api/v1/auth/refresh
```
No body. Sends the `refreshToken` cookie automatically (must be same-origin or CORS+credentials configured). Returns a new `accessToken` and rotates the refresh cookie. If this 401s, the session is truly dead — redirect to login.

**Logout**
```
POST /api/v1/auth/logout
```
Clears the cookie server-side.

**Logout everywhere** (revokes all of this admin's refresh tokens, e.g. "sign out of all devices")
```
POST /api/v1/auth/logout-all
Authorization: Bearer <accessToken>
```

### Student Auth (Google Sign-In)

Base path: `/api/v1/student-auth`

This is **not a variant of admin login** — it's Google Identity Services, restricted server-side to `@iitdh.ac.in` accounts. Only relevant to the Outbound Exchange Application feature.

**Setup on the frontend:**
1. Load Google Identity Services and render the sign-in button/prompt using the **Client ID** (a public, non-secret value — ask the backend owner for it, it's in `.env` as `GOOGLE_CLIENT_ID`).
2. Google's callback hands you a `credential` string (the ID token) — do not try to decode or validate it client-side, just forward it.

**Exchange it for a session:**
```
POST /api/v1/student-auth/google
Content-Type: application/json

{ "idToken": "<credential from Google>" }
```
Response: `{ "data": { "accessToken": "..." } }`, sets `studentRefreshToken` cookie. If the Google account isn't `@iitdh.ac.in`, you get **403** (`"Only iitdh.ac.in accounts can access this feature"`) — a valid Google login, just not an authorized one. A malformed/expired Google token gives **401**.

**Refresh / Logout** — identical shape to admin, but hit `/api/v1/student-auth/refresh` and `/api/v1/student-auth/logout`, and rely on the `studentRefreshToken` cookie (not `refreshToken`).

> Hiding the "Apply for Exchange" nav link from non-IITDH visitors is a UX nicety, not the security boundary — the 403 above is the real gate. A determined visitor can always find the URL; the backend rejects them regardless of what the UI shows.

---

## HTTP Caching on Public GET Endpoints

Every public (non-authenticated) `GET` list/detail endpoint sends a `Cache-Control` header:

```
Cache-Control: public, max-age=<N>, stale-while-revalidate=<5N>
```

| Tier | max-age | Applies to |
|---|---|---|
| 30s | Announcements, Events | changes most often |
| 60s | Site Content, Page aggregates | admin may want to see edits reflected soon |
| 300s (5 min) | Partners, Faculty, Team, Testimonials, FAQs, Gallery, Downloads, Programs, Contacts, MOUs | rarely edited |

This means the **browser itself** may serve a cached response without hitting the network at all within `max-age`, and will silently revalidate in the background for up to `max-age + stale-while-revalidate` seconds after that. If you're testing "did my admin edit show up" and it looks stale, hard-refresh (Ctrl+Shift+R) — that's the cache working as intended, not a bug. Pair this with a data-fetching library that respects HTTP caching (React Query with a reasonable `staleTime`, SWR, or even plain `fetch` — all honor `Cache-Control` automatically) rather than re-fetching on every render.

Authenticated endpoints and all mutations (`POST`/`PATCH`/`DELETE`) are **never** cached — don't cache them yourself either.

---

## File Uploads

**Any endpoint that accepts a file expects `multipart/form-data`, not JSON.** Build a `FormData` object and do **not** set a `Content-Type` header manually — the browser sets the correct multipart boundary automatically. Setting it yourself (e.g. copying a header object from a JSON request) will break the upload.

```js
const formData = new FormData();
formData.append("file", fileInput.files[0]);
await fetch("/api/v1/uploads/image/partners", {
  method: "POST",
  headers: { Authorization: `Bearer ${accessToken}` }, // no Content-Type!
  body: formData,
});
```

### Public uploads

Base path: `/api/v1/uploads` — admin-only (all routes require `authenticate`). Use this for any image/document field that belongs to one of the CRUD resources below (a Partner's `logoUrl`, a Download's `fileUrl`, an MOU's `documentPath`, etc.).

**Upload an image**
```
POST /api/v1/uploads/image/:folder
```
`:folder` must be one of: `partners`, `faculty`, `team`, `testimonials`, `gallery`, `events`, `site-content`. Field name in the form must be `file`. Accepts JPEG/PNG/WEBP/GIF, max 5MB. Response: `{ "data": { "url": "/uploads/partners/6f2c....png" } }`.

**Upload a document**
```
POST /api/v1/uploads/document/:folder
```
`:folder` must be one of: `downloads`, `mous`. Field name `file`. Accepts PDF only, max 10MB. Same response shape.

**Delete an uploaded file**
```
DELETE /api/v1/uploads?url=/uploads/partners/6f2c....png
```
Idempotent — deleting a file that's already gone still returns success. **Call this automatically whenever an admin replaces an existing image/document**, passing the *old* URL, right after you've saved the *new* URL onto the record. Nothing on the backend does this cleanup for you — if the frontend doesn't call it, old files just accumulate on disk forever.

> **Returned URLs are server-relative paths (`/uploads/...`), not full URLs.** If your frontend is served from a different origin than the API (true in dev, and true in prod unless both are proxied under one domain), you must prefix these with the API's origin before putting them in an `<img src>` — a bare `/uploads/...` will resolve against the frontend's own origin and 404.

### Private uploads

Documents submitted with the two application forms below (passport scans, transcripts, SOPs, recommendation letters) are **never** reachable via a public `/uploads/...` URL — they live outside the static file root entirely and can only be downloaded through an authenticated, per-application route (documented under each application section). Don't try to construct a direct link to them; you must `fetch()` with an `Authorization` header and handle the response as a blob.

---

## Resource Modules (CRUD)

These 12 modules all follow the **identical shape**: `GET /` (list, paginated, public), `GET /:id` (detail, public), `POST /` (create, admin-only), `PATCH /:id` (update, admin-only, all fields optional), `DELETE /:id` (admin-only). Only the field names differ per module. Base paths and fields below.

### Announcements — `/api/v1/announcements`
```ts
{ title: string, content: string, isPublic?: boolean, publishedAt?: string (ISO date) }
```
List query: `page`, `limit` (max 50, default 10), `isPublic` (`"true"`/`"false"`).

### Partners — `/api/v1/partners`
```ts
{ name: string, country: string, type: "UNIVERSITY" | "ORGANIZATION",
  focus?: string, website?: string (URL), logoUrl?: string (URL), isActive?: boolean }
```
List query: `page`, `limit` (max 100, default 50), `type`, `isActive`.

### Faculty — `/api/v1/faculty`
```ts
{ name: string, redirectUrl: string (URL), isActive?: boolean }
```
**Design note:** unlike a typical "faculty profile" model, this backend deliberately stores only a name and an external redirect link — no designation, department, email, bio, or photo fields exist. A faculty card in the UI is a name + a link that sends the visitor to an external profile page (e.g. the institute's own faculty directory), not an in-house detail page. Don't build a faculty detail page expecting bio/photo/department fields — they don't exist.
List query: `page`, `limit` (max 100, default 50), `isActive`.

### IRO Team — `/api/v1/team`
```ts
{ name: string, role: string, year: string, photoUrl?: string (URL), isActive?: boolean }
```
List query: `page`, `limit` (max 100, default 50), `isActive`.

### Testimonials — `/api/v1/testimonials`
```ts
{ name: string, country: string, program: string, text: string, photoUrl?: string (URL), isActive?: boolean }
```
List query: `page`, `limit` (max 50, default 10), `isActive`.

### FAQs — `/api/v1/faqs`
```ts
{ question: string, answer: string, order?: number (default 0), isActive?: boolean }
```
Sorted by `order` ascending (not creation date, not alphabetical) — lower numbers first. List query: `page`, `limit` (max 100, default 50), `isActive`.

### Gallery — `/api/v1/gallery`
```ts
{ title: string, imageUrl: string (URL), caption?: string,
  category?: "CAMPUS" | "EVENTS" | "STUDENT_LIFE" | "COLLABORATIONS" | "OTHER" (default OTHER),
  takenAt?: string (ISO date), isPublic?: boolean }
```
List query: `page`, `limit` (max 50, default 20), `category`, `isPublic`.

### Downloads — `/api/v1/downloads`
```ts
{ title: string, description?: string, fileUrl: string (URL), fileType?: string,
  category?: "ADMISSION_FORM" | "VISA_GUIDE" | "MOU_DOCUMENT" | "BROCHURE" | "OTHER" (default OTHER),
  isPublic?: boolean }
```
List query: `page`, `limit` (max 50, default 20), `category`, `isPublic`.

### Programs — `/api/v1/programs`
```ts
{ name: string, level: "UNDERGRADUATE" | "POSTGRADUATE" | "PHD",
  redirectUrl: string (URL), isActive?: boolean }
```
**Same design as Faculty**: no department/duration/description fields — a program card is a name + level badge + an external link. List query: `page`, `limit` (max 100, default 50), `level`, `isActive`.

### Events — `/api/v1/events`
```ts
{ title: string, description?: string, startDate: string (ISO date, required),
  endDate?: string (ISO date), location?: string, imageUrl?: string (URL),
  type?: "VISIT" | "CONFERENCE" | "WORKSHOP" | "EXCHANGE" | "OTHER" (default OTHER),
  isPublic?: boolean }
```
List query: `page`, `limit` (max 50, default 10), `type`, `isPublic`, and **`upcoming`** (`"true"`/`"false"`) — filters by `startDate >= now` / `< now`. Use `?upcoming=true` for a "Visits" page instead of fetching everything and filtering client-side.

### Contacts — `/api/v1/contacts`
```ts
{ type: "CHAIRPERSON" | "IRO_OFFICE" | "MOBILITY" | "ADMISSION",
  name?: string, title: string, email: string, phone?: string, address?: string, isActive?: boolean }
```
No pagination on the list endpoint (small, fixed dataset) — just `isActive` as an optional filter.

---

## Site Content

Base path: `/api/v1/site-content` — the mechanism for admin-editable text/numbers/images that aren't part of a repeating list (homepage hero title, stat numbers, leadership quotes, footer text, Admission page "key facts", etc.).

**GET all** (optionally `?page=home` to filter by grouping — `home`, `about`, `admission`, `footer`, `global`; unrelated to pagination):
```
GET /api/v1/site-content
GET /api/v1/site-content?page=home
```
**GET one:**
```
GET /api/v1/site-content/home.hero.title
```
**Update one** (admin-only):
```
PATCH /api/v1/site-content/home.hero.title
{ "value": "New Title" }
```
**Bulk update** (admin-only, atomic — if any key in the batch doesn't exist, the whole batch is rejected and nothing changes):
```
PATCH /api/v1/site-content/bulk
{ "updates": [{ "key": "home.hero.title", "value": "..." }, { "key": "footer.phone", "value": "..." }] }
```

### Critical constraints

1. **There is no create endpoint.** Every `key` that exists was defined once in the backend's seed script. You cannot invent a new editable field through the API — a `PATCH` to a nonexistent key returns `404`, it does **not** create it. If you need a new editable field, that's a backend change (a new seed row), not something the frontend can self-serve.
2. **`type` is a UI hint, not a validation rule.** Each entry has a `type`: `TEXT`, `RICH_TEXT`, `IMAGE`, or `NUMBER` — this tells your admin-edit form which input widget to render (text box, textarea, image uploader, number box). The backend stores every value as a plain string regardless.
3. **`IMAGE`-type values are server-relative paths** (from the upload endpoint), same origin-prefixing caveat as [File Uploads](#file-uploads) above.
4. **`RICH_TEXT` values may contain multiple paragraphs, separated by a blank line (`\n\n`) inside the one string.** Split on `\n\n` and render one `<p>` per resulting piece — never assume a fixed paragraph count, and never build your admin form around "paragraph 1 / paragraph 2" as separate inputs. A future edit might turn a five-paragraph welcome message into two, or two into eight; the contract is designed so that's just an edit to one value, not a schema change. Test your renderer against the seeded `home.leadership.directorQuote` key — it's a real 5-paragraph example.

---

## Page Aggregation Endpoints

Base path: `/api/v1/pages` — composes 2+ resources into one response for pages that need it, so you don't fire 3-5 separate requests before a page can render anything.

```
GET /api/v1/pages/home        → { siteContent: [...], testimonials: [...] }
GET /api/v1/pages/about       → { siteContent: [...], partners: [...] }
GET /api/v1/pages/admission   → { siteContent: [...] }
```

Only these three keys exist (`home`, `about`, `admission`) — any other value 400s. **Pages not listed here** (Partners directory, Gallery, Downloads — anywhere a full filterable/paginated list is the point) have no aggregate; call that resource's own endpoint directly so you keep its pagination/filter controls.

---

## Student Applications (Inbound)

Base path: `/api/v1/applications` — foreign national admissions intake. **This is the one write endpoint in the entire API with no login requirement** (an applicant has no account yet).

**Submit** (public, rate-limited to 5 submissions/hour/IP):
```
POST /api/v1/applications          Content-Type: multipart/form-data
```
Text fields (all required unless marked optional):
```ts
firstName, lastName, dateOfBirth (ISO date), gender ("MALE"|"FEMALE"|"OTHER"|"PREFER_NOT_TO_SAY"),
nationality, countryOfResidence, passportNumber, passportExpiryDate (ISO date),
email, phone, currentAddress, emergencyContactName, emergencyContactPhone,
emergencyContactRelation (optional), programLevel ("UNDERGRADUATE"|"POSTGRADUATE"|"PHD"),
programAppliedFor, intendedIntake, highestQualification, previousInstitution, previousGradeOrGPA,
englishTestType (optional, default "NOT_APPLICABLE"; one of IELTS/TOEFL/PTE/DUOLINGO/NATIVE_SPEAKER/OTHER/NOT_APPLICABLE),
englishTestScore (optional), visaCategory (optional),
requiresVisaSponsorship (optional, default true — see boolean gotcha below)
```
File fields (all optional, PDF/JPEG/PNG, 10MB each): `passportCopy`, `photo`, `academicTranscripts`, `englishTestScoreCard`, `statementOfPurpose`, `financialProof`, `recommendationLetter`.

Response only returns `{ "data": { "id": "..." } }` — no personal data is echoed back to an anonymous caller.

> **Boolean gotcha:** `requiresVisaSponsorship` is parsed with `z.coerce.boolean()`, which treats **any non-empty string as `true`** — including the literal string `"false"`. Always send the exact string `"true"` or `"false"`, never omit the field for an unchecked box, or an intended "false" will be silently stored as `true`.

**Admin-only endpoints** (all require `Authorization: Bearer <admin accessToken>`):
```
GET    /api/v1/applications                       list, filterable by status/nationality/programLevel/search, paginated
GET    /api/v1/applications/:id                    full detail including document paths
PATCH  /api/v1/applications/:id                     { status?, reviewNotes? } — status one of
                                                     SUBMITTED/UNDER_REVIEW/DOCUMENTS_REQUESTED/ACCEPTED/REJECTED/WAITLISTED/WITHDRAWN
DELETE /api/v1/applications/:id                     deletes the row and all its uploaded documents
GET    /api/v1/applications/:id/documents/:field    stream one document (field = one of the 7 file field names above)
```
The document-download route **requires the `Authorization` header** — it cannot be used as a plain `<a href>` link (no header) or via `window.open(url)`. Fetch it with the header, get a blob, then open/download that blob client-side.

---

## Outbound Exchange Applications

Base path: `/api/v1/outbound-applications` — for **existing IITDH students** applying to go on exchange elsewhere. Requires [Student Auth](#student-auth-google-sign-in) — an admin token does not work here (see the role-isolation note above).

**Submit** (student-only):
```
POST /api/v1/outbound-applications          Content-Type: multipart/form-data
Authorization: Bearer <student accessToken>
```
Text fields:
```ts
partnerId (UUID — must be a real id from GET /api/v1/partners), rollNumber, branch, currentYear, cgpa,
programType ("SEMESTER_EXCHANGE"|"RESEARCH_INTERNSHIP"|"SUMMER_PROGRAM"|"DUAL_DEGREE"|"OTHER"),
intendedSemester, motivation
```
File fields (all optional, PDF/JPEG/PNG, 10MB each): `statementOfPurpose`, `transcript`, `recommendationLetter`. There's no `email`/`name` field — the applicant's identity comes from their verified session, not the request body.

**Student checks their own applications:**
```
GET /api/v1/outbound-applications/mine
Authorization: Bearer <student accessToken>
```

**Admin-only:**
```
GET   /api/v1/outbound-applications              list, filterable by status/partnerId, paginated
GET   /api/v1/outbound-applications/:id          full detail
PATCH /api/v1/outbound-applications/:id           { status?, reviewNotes? } — status one of
                                                   SUBMITTED/UNDER_REVIEW/NOMINATED/ACCEPTED_BY_PARTNER/REJECTED/WITHDRAWN
```
(No document-download or delete route exists yet for this module — build that the same way as the inbound-application one if/when it's needed.)

---

## MOU Tracking

Base path: `/api/v1/mous` — structured records of the institute's MOUs, linked to a `Partner`.

```ts
{ partnerId: string (UUID, must be a real partner), title: string,
  signedDate: string (ISO date), expiryDate?: string (ISO date),
  status?: "ACTIVE" | "EXPIRED" | "RENEWED" | "TERMINATED" (default ACTIVE),
  scope?: string, documentPath?: string }
```
`documentPath` is populated via the [public document upload](#public-uploads) endpoint with `:folder = mous` — MOU documents are public by default (a trust signal, like the Partners page), unlike student application documents.

List/detail are public (cached 300s); create/update/delete are admin-only. List query adds **`expiringWithinDays`** (integer) on top of the usual `page`/`limit`/`partnerId`/`status` — e.g. `?expiringWithinDays=90` returns MOUs whose `expiryDate` falls within the next 90 days, for a "renewals coming up" dashboard widget.

---

## Dashboard Stats

```
GET /api/v1/stats
Authorization: Bearer <admin accessToken>
```
```json
{
  "data": {
    "pendingApplications": 3,
    "totalApplications": 12,
    "announcements": 8,
    "partners": 9,
    "faculty": 5,
    "galleryImages": 20,
    "activeMous": 6
  }
}
```
One aggregate read for a dashboard home screen — use this instead of calling 6 different list endpoints and counting results yourself.

---

## Full Endpoint Reference Table

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api` | — | Health check (no `/v1`) |
| POST | `/api/v1/auth/login` | — | Admin login |
| POST | `/api/v1/auth/refresh` | cookie | Rotate admin refresh token |
| POST | `/api/v1/auth/logout` | cookie | Clear admin session |
| POST | `/api/v1/auth/logout-all` | Admin | Revoke all admin sessions |
| POST | `/api/v1/student-auth/google` | — | Exchange Google ID token for student session |
| POST | `/api/v1/student-auth/refresh` | cookie | Rotate student refresh token |
| POST | `/api/v1/student-auth/logout` | cookie | Clear student session |
| GET/POST/PATCH/DELETE | `/api/v1/announcements[/:id]` | GET public, writes Admin | |
| GET/POST/PATCH/DELETE | `/api/v1/partners[/:id]` | GET public, writes Admin | |
| GET/POST/PATCH/DELETE | `/api/v1/faculty[/:id]` | GET public, writes Admin | name+redirectUrl only |
| GET/POST/PATCH/DELETE | `/api/v1/team[/:id]` | GET public, writes Admin | |
| GET/POST/PATCH/DELETE | `/api/v1/testimonials[/:id]` | GET public, writes Admin | |
| GET/POST/PATCH/DELETE | `/api/v1/faqs[/:id]` | GET public, writes Admin | |
| GET/POST/PATCH/DELETE | `/api/v1/gallery[/:id]` | GET public, writes Admin | |
| GET/POST/PATCH/DELETE | `/api/v1/downloads[/:id]` | GET public, writes Admin | |
| GET/POST/PATCH/DELETE | `/api/v1/programs[/:id]` | GET public, writes Admin | name+level+redirectUrl only |
| GET/POST/PATCH/DELETE | `/api/v1/events[/:id]` | GET public, writes Admin | supports `?upcoming=` |
| GET/POST/PATCH/DELETE | `/api/v1/contacts[/:id]` | GET public, writes Admin | not paginated |
| GET/POST/PATCH/DELETE | `/api/v1/mous[/:id]` | GET public, writes Admin | supports `?expiringWithinDays=` |
| POST | `/api/v1/uploads/image/:folder` | Admin | folder allow-list, 5MB, image types |
| POST | `/api/v1/uploads/document/:folder` | Admin | folder allow-list, 10MB, PDF only |
| DELETE | `/api/v1/uploads?url=` | Admin | idempotent |
| GET | `/api/v1/site-content[?page=]` | — | |
| GET | `/api/v1/site-content/:key` | — | |
| PATCH | `/api/v1/site-content/bulk` | Admin | atomic |
| PATCH | `/api/v1/site-content/:key` | Admin | 404 if key doesn't exist, never creates |
| GET | `/api/v1/pages/:page` | — | `home` \| `about` \| `admission` only |
| POST | `/api/v1/applications` | — (rate-limited 5/hr) | multipart, inbound admissions |
| GET/PATCH/DELETE | `/api/v1/applications/:id` | Admin | |
| GET | `/api/v1/applications` | Admin | list/filter |
| GET | `/api/v1/applications/:id/documents/:field` | Admin | needs `Authorization` header, not a link |
| POST | `/api/v1/outbound-applications` | Student | multipart |
| GET | `/api/v1/outbound-applications/mine` | Student | |
| GET/PATCH | `/api/v1/outbound-applications[/:id]` | Admin | list/review |
| GET | `/api/v1/stats` | Admin | dashboard counts |

---

## Frontend Integration Checklist

Things that have actually broken or would obviously break integration — check every one of these before shipping a feature against this API.

- [ ] **Two separate sessions, two separate token stores.** Never let admin and student login flows share a variable, context, or storage key. A student token silently fails on admin routes and vice versa (by design — verified via cross-testing during development).
- [ ] **Never store access tokens in `localStorage`.** Keep them in memory (React state/context); rely on the httpOnly refresh cookie to restore a session on page reload (call `/refresh` on app boot).
- [ ] **`credentials: "include"`** on every fetch/axios call that needs to send or receive the refresh cookie (login, refresh, logout for both systems).
- [ ] **File uploads are `multipart/form-data`, never JSON.** Use `FormData`, never set `Content-Type` manually.
- [ ] **All `/uploads/...` and `IMAGE`-type site-content URLs are server-relative.** Prefix with the API's origin before rendering, or they'll 404 against the frontend's own origin.
- [ ] **Delete old files on replace.** When an admin swaps an image/document on an existing record, call `DELETE /uploads?url=<old>` right after saving the new URL — nothing does this automatically.
- [ ] **`requiresVisaSponsorship` (and any other checkbox sent via `FormData`) must be the literal string `"true"`/`"false"`, never omitted.** `z.coerce.boolean()` treats any non-empty string — including `"false"` — as truthy at the JS/Zod boundary; only the exact strings matter here because the backend checks them explicitly... but don't rely on that being obvious from any other checkbox you add later. When in doubt, always send an explicit `"true"`/`"false"` string, never rely on omission meaning `false`.
- [ ] **Document downloads (`/applications/:id/documents/:field`) need an `Authorization` header** — fetch as a blob, don't link directly or use `window.open`.
- [ ] **`RICH_TEXT` site-content values may have multiple paragraphs joined by `\n\n`.** Split and render one `<p>` per piece; never hardcode a paragraph count.
- [ ] **Site-content keys are fixed** — there is no "add a new editable field" self-service. New keys require a backend change (a seed-script row), not an API call.
- [ ] **Faculty and Programs have no bio/department/description fields.** They're name + link cards by design — don't build detail pages assuming richer data exists.
- [ ] **Respect `Cache-Control` on public GETs** — don't manually cache-bust every request; a stale-looking response after an admin edit within the cache window is expected, not a bug.
- [ ] **The public application-submission endpoint is rate-limited to 5/hour/IP** — handle `429` gracefully in the form (a clear "please try again later" message, not a generic error).
- [ ] **Only three page aggregates exist** (`home`, `about`, `admission`) — every other page calls its own resource endpoint(s) directly.
