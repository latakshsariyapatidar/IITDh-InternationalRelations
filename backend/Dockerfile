FROM node:20-alpine

WORKDIR /app

# Install openssl which is required by Prisma on alpine
RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
