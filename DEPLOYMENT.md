# IRO — Production Deployment Runbook

This document covers everything needed to deploy the IRO website to a Linux production server from scratch.

---

## Prerequisites

| Requirement | Version |
|---|---|
| Linux server (Ubuntu 22.04+ recommended) | — |
| Docker Engine | 24+ |
| Docker Compose plugin (v2) | 2.20+ |
| Open inbound ports | 80, 443 (if using host-nginx for TLS) |
| RAM | 2 GB minimum, 4 GB recommended |

Install Docker on Ubuntu:
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # then log out and back in
docker compose version           # should print v2.x
```

---

## First-Time Deployment

### 1. Clone the repository

```bash
git clone https://github.com/latakshsariyapatidar/IITDh-InternationalRelations.git
cd IITDh-InternationalRelations
```

### 2. Create your `.env` file

```bash
cp .env.production.example .env
nano .env   # fill in every placeholder — do NOT leave any "replace_with_" values
```

### 3. Generate cryptographically strong secrets

Run these commands and paste the output into `.env`:

```bash
# JWT_SECRET
openssl rand -base64 48

# EXPORT_LINK_SECRET  (must be different from JWT_SECRET)
openssl rand -base64 48

# POSTGRES_PASSWORD
openssl rand -base64 24
```

### 4. Set your domain in `.env`

```dotenv
PUBLIC_API_BASE_URL=https://iro.iitdh.ac.in
CORS_ORIGIN=https://iro.iitdh.ac.in
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
```

### 5. Build and start the stack

```bash
docker compose up -d --build
```

This starts 4 services: `db` → `migrate` → `backend` → `frontend`.

### 6. Seed the database (first deploy only)

The seed script creates the initial admin account and required `site-content` rows. Run it **once** after the first successful deploy:

```bash
docker compose exec backend npm run seed
```

> The seed is idempotent — running it again is harmless, but it is not run automatically on container restart.

### 7. Verify

```bash
docker compose ps          # all services should be "running" or "exited 0"
docker compose logs -f     # watch live logs
curl http://localhost:8080  # should return the frontend HTML
```

---

## TLS / HTTPS (Recommended — Host nginx + Certbot)

The stack exposes port `8080` on the host. Terminate TLS at the host level using nginx + Let's Encrypt:

### Install nginx and certbot

```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Create nginx virtual host

```nginx
# /etc/nginx/sites-available/iro
server {
    listen 80;
    server_name iro.iitdh.ac.in;

    location / {
        proxy_pass         http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        "upgrade";
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/iro /etc/nginx/sites-enabled/iro
sudo nginx -t && sudo systemctl reload nginx

# Obtain TLS certificate
sudo certbot --nginx -d iro.iitdh.ac.in
```

Certbot will auto-renew via a systemd timer. After TLS is enabled, set in `.env`:

```dotenv
COOKIE_SECURE=true
COOKIE_SAMESITE=lax
TRUST_PROXY=2   # host nginx + container nginx = 2 hops
```

Then restart the backend: `docker compose restart backend`

---

## Subsequent Deployments

```bash
git pull origin main
docker compose up -d --build
```

Docker Compose will rebuild only changed images and restart affected services. The `migrate` service runs automatically and applies any new Prisma migrations before the backend starts.

---

## Useful Operations

### View logs
```bash
docker compose logs -f backend    # backend only
docker compose logs -f            # all services
```

### Run a database migration manually
```bash
docker compose exec backend npm run db:deploy
```

### Open a Prisma Studio session (admin DB GUI)
```bash
docker compose exec backend npx prisma studio
# then port-forward 5555 to your local machine via SSH
```

### Access PostgreSQL directly
```bash
docker compose exec db psql -U postgres -d iro_db
```

### Restart a single service
```bash
docker compose restart backend
```

---

## Backup

> ⚠️ **Back up regularly.** Losing the postgres volume or the uploads folder loses all data permanently.

### Database
```bash
docker compose exec db pg_dump -U postgres iro_db > backup_$(date +%Y%m%d).sql
```

### Uploaded files
```bash
tar -czf uploads_$(date +%Y%m%d).tar.gz backend/uploads backend/private-uploads
```

Schedule both via cron and copy to off-server storage (S3, rsync, etc.).

---

## Rotating Secrets

1. Generate a new value: `openssl rand -base64 48`
2. Update the key in `.env`
3. Restart the affected service: `docker compose restart backend`

> Rotating `JWT_SECRET` invalidates all active admin/faculty/student sessions — users will need to log in again.

---

## Visitor Delegation Registration Form

The form for registering visiting delegations is available at:

```
https://your-domain.example.com/iro/delegate-registration
```

**This URL is intentionally not linked anywhere on the public website.**  
Share it directly with visiting delegates or host faculty via email.  
Anyone with this URL can submit a registration — the backend accepts unauthenticated submissions.

---

## Health Checks

| Endpoint | Expected response |
|---|---|
| `GET /healthz` (via backend port 3000) | `200 OK` |
| `GET http://localhost:8080` | Frontend HTML |

Docker Compose runs its own healthchecks — see `docker compose ps` for status.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `migrate` service exits with non-zero | DB not ready or bad `DATABASE_URL` | Check `docker compose logs migrate` |
| Backend returns 500 on all routes | Missing env var | Check `docker compose logs backend` for `must be set` errors |
| Frontend shows blank page | Build failed | `docker compose logs frontend` |
| Google OAuth does not work | Wrong `GOOGLE_CLIENT_ID` or redirect URI not registered | Add your domain to authorised redirect URIs in Google Cloud Console |
| Uploads return 403 | Ownership issue on `backend/uploads` | `docker compose exec backend chown -R appuser:appgroup /app/uploads` |

---

## Security Notes

- **Never commit `.env`** — it is gitignored
- **Rotate secrets** if you suspect exposure
- **Review `private-uploads`** regularly — passport scans should be deleted after the application decision (suggested: 90-day retention policy)
- **Keep Docker and host OS updated** — `sudo apt upgrade` and `docker compose pull` periodically
- Admin password changes must currently be done directly in the database (backend feature pending)
