# Feature Specification & Portal Modules

This document details every major module, user workflow, and administrative capability across the IIT Dharwad International Relations platform.

---

## 1. Public Portal & Institutional Showcase

### A. Dynamic Hero Section (`/`)
- **Visuals**: Full-bleed responsive slideshow showcasing the permanent IIT Dharwad campus architecture.
- **Overlay & Contrast**: Subtly darkened overlay (`bg-black/35`) ensuring high-contrast legibility for titles, badges, and subtitles regardless of daylight or image brightness.
- **Dynamic Content**: Title, tagline, statistics, and Director's message are pulled live from the database (`/api/v1/site-content`).

### B. International Admissions (`/international-admissions`)
- **Overview**: Dedicated program guidelines for full-time international undergraduate and postgraduate degree candidates.
- **Application Portal (`/international-admissions/apply`)**: Multi-step application submission capturing academic history, target program, passport details, and supporting document uploads.
- **Canonical Route Handling**: Automatically redirects legacy `/admission` and `/apply` routes to canonical `/international-admissions` paths.

### C. International Mobility & Collaborations (`/international-mobility`)
- **Programs**: Inbound foreign student exchanges and Outbound IIT Dharwad student semester exchanges.
- **Online Intake (`/international-mobility/apply`)**: Inbound exchange application form with home institution nomination verification.

### D. Opportunities Hub (`/opportunities`)
- **Search & Discovery**:
  - Real-time instant text search across titles, host organizations, and descriptions.
  - Category filter pills: *All*, *Internship*, *Research*, *Exchange*, *Fellowship*, *Job*.
  - Target audience toggle: *All*, *Students*, *Faculty*.
- **Interactive Details Modal**: Clicking any opportunity card opens a comprehensive modal with deadlines, eligibility criteria, benefits, contact emails, and direct external application links.

### E. Partner Universities & Bilateral MOUs (`/partners`)
- **Institution Directory**:
  - Filterable by type: *All Collaborations*, *Universities*, *Organizations & Consortia*, *Active MOUs*.
  - Country filter dropdown with dynamic counts.
  - Official country flags via SVG CDN integration.
  - Institution logo rendering with fallback to name initials on image load failure.
- **Signed Agreement Access**:
  - Authenticated IIT Dharwad users can view validity dates and download the full signed bilateral agreement PDF.

### F. Life at IIT Dharwad (`/life`)
- **Campus Integration**: Comprehensive overview of student amenities, sports complexes, and laboratories.
- **Direct Portal Links**: Verified direct links to official student welfare services:
  - Hostels: `https://studentswelfare.iitdh.ac.in/hostels`
  - Mess & Dining: `https://studentswelfare.iitdh.ac.in/mess_canteen`

### G. Resources & Document Downloads (`/downloads`)
- Categorized repository of application forms, visa application guidelines, and official institutional brochures.

---

## 2. Administrative Control Panel (`/admin`)

The administration portal is protected by role-based authorization and session cookies:

### A. Partner & Bilateral Agreement Management
- Register partner universities, overseas research agencies, and academic consortia.
- Designate IIT Dharwad faculty champions (`championName`, `championDesignation`).
- Upload high-resolution university logos.
- Manage Memorandums of Understanding (MOUs): Set effective and expiry dates, upload signed PDF contracts to private storage.

### B. Admissions & Applications Dashboard
- Unified view of all submitted applications (Degree Admissions, Inbound Exchanges, Outbound Exchanges).
- Status workflow: `PENDING` ➔ `UNDER_REVIEW` ➔ `ACCEPTED` / `REJECTED`.
- **Export to Excel (`/api/v1/applications/export`)**: Generates formatted XLSX spreadsheets. Embedded links to private applicant documents (passports, transcripts) are cryptographically signed with HMAC tokens that remain valid for 30 days.

### C. Automated Expiry Sweeps & Notifications
- Daily scheduled background cron job scans:
  - MOUs expiring within 60 days.
  - Inbound foreign student visas expiring within 30 days.
  - Passports nearing expiration.
- Generates admin notifications and sends a bundled email digest to the IRO office.
- Manual trigger available on-demand via the dashboard.

### D. Site Content & CMS
- Real-time editor for homepage stats (NIRF rank, campus acreage, active partnerships).
- Director's official message and photo updates.
- Testimonial manager and campus photo gallery curator.

---

## 3. Faculty Portal (`/faculty-portal`)

- Secure authentication via Google Workspace (`@iitdh.ac.in`).
- Allows verified professors to post collaborative student opportunities, research fellowships, and summer internships without requiring full administrative access.
