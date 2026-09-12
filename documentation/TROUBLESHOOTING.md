# Troubleshooting & Incident Runbook

This document serves as the primary operational runbook for diagnosing, debugging, and resolving issues with the IIT Dharwad IRO platform in production.

---

## 🚨 Emergency Diagnostic Checklist

When an alert or user report is received, perform these five initial checks:

```bash
# 1. Are all containers running?
docker compose ps

# 2. Check recent application error logs:
docker compose logs --tail=100 -f backend

# 3. Check web server logs:
docker compose logs --tail=100 -f frontend

# 4. Is PostgreSQL accepting connections?
docker compose exec db pg_isready -U postgres -d iro_db

# 5. Is server disk space exhausted?
df -h
```

---

## 🛠️ Common Incident Scenarios & Fixes

### 1. Admin Login Works, but Refresh Logouts Immediately (Session Dropped)
- **Symptom**: The user logs in successfully, but navigating to any dashboard view or refreshing causes an immediate redirect back to login (`401 Unauthorized`).
- **Cause**: Browser cookie security mismatch.
  - When `NODE_ENV=production`, `COOKIE_SECURE` defaults to `true`.
  - If accessing over plain `http://` or through a proxy that strips the `X-Forwarded-Proto: https` header, the browser refuses to store or send the refresh cookie.
- **Fix**:
  1. In host Nginx configuration, verify `proxy_set_header X-Forwarded-Proto $scheme;` is present.
  2. Ensure `TRUST_PROXY=1` is configured in `.env`.
  3. If temporarily testing without SSL, set `COOKIE_SECURE=false` in `.env` and restart containers (`docker compose up -d`).

---

### 2. File / Image Uploads Fail with Error `413 Request Entity Too Large`
- **Symptom**: Uploading large PDFs or high-resolution images fails with HTTP 413 or a generic upload failure.
- **Cause**: The reverse proxy (Nginx) has a default 1MB request ceiling.
- **Fix**:
  - The internal frontend Nginx configuration has been set to `client_max_body_size 50M;`.
  - Ensure the **host machine's outer Nginx** also includes:
    ```nginx
    client_max_body_size 50M;
    ```
    Then reload: `sudo nginx -s reload`.

---

### 3. Missing or Broken University Logos on `/partners`
- **Symptom**: University logo circle displays a broken image icon.
- **Cause**: Uploaded partner logos are stored as relative URLs (e.g. `/uploads/partners/...`). If the frontend attempts to fetch from the frontend origin without the API prefix or if the file was deleted from disk.
- **Fix**:
  - The frontend includes `resolveLogoUrl()` which prefixes the backend URL and automatically falls back to the institution's initial letter if an image fails to load.
  - Check if the uploaded file exists inside the persistent volume:
    ```bash
    docker compose exec backend ls -la /app/uploads/partners
    ```

---

### 4. Google Sign-In Fails or Displays Domain Error
- **Symptom**: Clicking "Sign in with Google" returns an authentication error or unauthorized message.
- **Cause**:
  1. The user is attempting to sign in with a personal account (`@gmail.com`) rather than an institutional `@iitdh.ac.in` account.
  2. The Google Cloud Console OAuth Client does not list the production domain in **Authorized JavaScript Origins** or **Authorized Redirect URIs**.
- **Fix**:
  - Add your production domain (`https://iro.iitdh.ac.in`) in Google Cloud Console under *APIs & Services > Credentials > OAuth 2.0 Client IDs*.

---

### 5. Database Migration Lock or Drift
- **Symptom**: Backend container startup hangs or outputs `P3005: The database schema is not empty`.
- **Cause**: A manual schema change occurred or a prior migration was interrupted.
- **Fix**:
  ```bash
  # Check migration status
  docker compose exec backend npx prisma migrate status --config src/config/prisma.config.ts

  # Mark a failed migration as applied or rolled back
  docker compose exec backend npx prisma migrate resolve --applied "<migration_name>" --config src/config/prisma.config.ts
  ```

---

### 6. Emergency Admin Password Reset
- **Symptom**: Administrator credentials are lost or locked.
- **Fix**:
  1. In `.env`, set:
     ```env
     SEED_ADMIN_PASSWORD=NewTemporaryStrongPassword123!
     SEED_RESET_ADMIN_PASSWORD=true
     ```
  2. Run the seed script inside the container:
     ```bash
     docker compose exec backend npm run seed
     ```
  3. Reset `SEED_RESET_ADMIN_PASSWORD=false` in `.env` afterwards.

---

### 7. Automated Notification Cron Sweep Verification
- **Symptom**: Daily expiry emails or admin alert notifications are not appearing.
- **Fix**:
  1. Verify cron expression in `.env` (`REMINDER_CRON="0 7 * * *"`).
  2. Trigger an immediate manual scan from an authenticated terminal:
     ```bash
     docker compose exec backend node -e "import('./dist/modules/notification/notification.reminders.js').then(m => m.runReminderScan())"
     ```
  3. Inspect SMTP credentials (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`).
