# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# API base path — proxied through nginx at runtime
ENV VITE_API_URL=/api/v1

RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
# Pinned version for reproducible, auditable deploys.
# nginx master process binds port 80 (requires root); worker processes
# run as the unprivileged `nginx` user — this is the standard nginx pattern.
FROM nginx:1.27-alpine AS production

# Remove default nginx welcome page to prevent version/config disclosure
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
