FROM node:20-alpine

WORKDIR /app

# Install openssl for Prisma engine and netcat for PostgreSQL connection polling
RUN apk add --no-cache openssl netcat-openbsd

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

RUN npm ci

# Copy application source code
COPY . .

# Generate Prisma Client and compile TypeScript to dist/
RUN npm run db:generate
RUN npm run build

# Create persistent upload directories if they do not exist
RUN mkdir -p /app/uploads /app/private-uploads

EXPOSE 3000

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
