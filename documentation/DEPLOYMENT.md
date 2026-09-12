# Production Deployment Guide

This guide provides step-by-step instructions for deploying the IIT Dharwad IRO web platform to a production Linux server (Ubuntu/Debian) using Docker and Docker Compose.

---

## 1. Server Prerequisites

- **Operating System**: Ubuntu 22.04 LTS or 24.04 LTS
- **Hardware Minimum**: 2 CPU Cores, 4 GB RAM, 25 GB SSD storage
- **Installed Software**:
  - Docker Engine 24+ & Docker Compose v2+
  - Git
  - Nginx (for host SSL termination) & Certbot

```bash
# Update packages and install Docker on Ubuntu
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

---

## 2. Environment Configuration

1. **Clone the Repository**:
   ```bash
   git clone <repository-url> /opt/iro-platform
   cd /opt/iro-platform
   ```

2. **Generate Cryptographic Secrets**:
   Generate a high-entropy secret for JWT signing and document tokens:
   ```bash
   openssl rand -base64 48
   ```

3. **Create the Production `.env` File**:
   Copy `.env.production.example` to `.env`:
   ```bash
   cp .env.production.example .env
   nano .env
   ```

   **Mandatory Production Settings**:
   - `POSTGRES_PASSWORD`: Choose a strong 32+ character random password.
   - `JWT_SECRET`: Paste the generated base64 secret.
   - `EXPORT_LINK_SECRET`: Paste a second unique base64 secret.
   - `SEED_ADMIN_PASSWORD`: Strong password for the default administrator account.
   - `PUBLIC_API_BASE_URL`: Public domain URL (e.g. `https://iro.iitdh.ac.in`).
   - `CORS_ORIGIN`: Permitted origins (e.g. `https://iro.iitdh.ac.in`).
   - `TRUST_PROXY`: Set to `1` (indicates one reverse proxy sitting in front).
   - `COOKIE_SECURE`: Set to `true` (enforces HTTPS cookie transmission).

---

## 3. Building & Launching the Containers

Execute the optimized build:

```bash
# Build the optimized production containers
docker compose build

# Start services in detached mode
docker compose up -d
```

### Container Boot Sequence:
1. **`iro_postgres_db`**: Starts PostgreSQL 15 and runs internal healthchecks (`pg_isready`).
2. **`iro_backend`**: Waits until PostgreSQL reports healthy, deploys pending Prisma migrations (`prisma migrate deploy`), initializes seed records (admin user, categories, initial partners), and launches the Express server on port 3000.
3. **`iro_frontend`**: Nginx container starts serving compiled Vite production assets on port 8080 and proxies `/api/` and `/uploads/` to the backend.

---

## 4. Verification & Container Health

```bash
# Verify container status
docker compose ps

# Inspect backend startup logs
docker compose logs -f backend

# Verify database connection
docker compose exec db pg_isready -U postgres -d iro_db
```

Expected output for `docker compose ps`:
```
NAME              IMAGE                   COMMAND                  SERVICE    STATUS
iro_backend       iro-backend             "/app/entrypoint.sh"     backend    Up (healthy)
iro_frontend      iro-frontend            "/docker-entrypoint.…"   frontend   Up
iro_postgres_db   postgres:15-alpine      "docker-entrypoint.s…"   db         Up (healthy)
```

---

## 5. Host Nginx & SSL Setup (Let's Encrypt)

To serve the application securely over HTTPS on port 443, configure Nginx on the host machine:

1. **Create Nginx Configuration** (`/etc/nginx/sites-available/iro.conf`):
   ```nginx
   server {
       listen 80;
       server_name iro.iitdh.ac.in;

       # Max upload size (transcripts, portfolios, signed agreements)
       client_max_body_size 50M;

       location / {
           proxy_pass http://127.0.0.1:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. **Enable Site & Obtain SSL Certificate**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/iro.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx

   # Obtain SSL certificate
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d iro.iitdh.ac.in
   ```

---

## 6. Backup & Recovery Procedures

### Automated Database Backup
Create a daily backup cron script (`/opt/iro-platform/backup.sh`):
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/iro"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

# Dump PostgreSQL database
docker compose -f /opt/iro-platform/docker-compose.yml exec -T db pg_dump -U postgres iro_db | gzip > "$BACKUP_DIR/db_$TIMESTAMP.sql.gz"

# Backup uploads
tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" -C /opt/iro-platform/backend uploads private-uploads

# Keep only 14 days of backups
find "$BACKUP_DIR" -type f -mtime +14 -delete
```
Make executable and schedule in `crontab -e`:
```bash
chmod +x /opt/iro-platform/backup.sh
0 2 * * * /opt/iro-platform/backup.sh
```

### Restoring from Backup
```bash
# Decompress and restore database
gunzip < /var/backups/iro/db_YYYYMMDD.sql.gz | docker compose exec -T db psql -U postgres iro_db
```
