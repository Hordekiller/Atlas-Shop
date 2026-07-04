# Docker Best Practices — Reference

## PostgreSQL in Docker
```yaml
# docker-compose.yml — production-ready PostgreSQL
db:
  image: postgres:16-bookworm
  restart: always
  shm_size: 256mb  # align with shared_buffers
  environment:
    POSTGRES_USER: ${POSTGRES_USER:-atlas}
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    POSTGRES_DB: ${POSTGRES_DB:-atlas_shop}
    POSTGRES_INITDB_ARGS: "--locale=C --encoding=UTF8"
  volumes:
    - pgdata:/var/lib/postgresql/data
    - ./init-db:/docker-entrypoint-initdb.d:ro  # optional init scripts
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-atlas} -d ${POSTGRES_DB:-atlas_shop}"]
    interval: 10s
    timeout: 5s
    retries: 5
    start_period: 30s
  deploy:
    resources:
      limits:
        memory: 2g
        cpus: "2"
  ports:
    - "5432:5432"
```

## Multi-stage Dockerfile
```dockerfile
# Builder stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/api/package.json apps/api/
COPY packages/ packages/
RUN npm ci --only=production
COPY . .
RUN npm run build -w @atlas-shop/api
RUN npm prune --production

# Production stage
FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api/prisma ./prisma
COPY apps/api/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/api/v1', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

ENTRYPOINT ["./docker-entrypoint.sh"]
```

## docker-entrypoint.sh
```bash
#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Generating Prisma client..."
npx prisma generate

echo "Starting application..."
exec node dist/main.js
```

## .dockerignore
```
node_modules
.git
.turbo
dist
.next
.env
.env.local
*.log
.gitignore
```

## Security
- Never hardcode secrets in docker-compose → use ${VAR} with .env
- Use `restart: always` for critical services
- Set memory limits (`deploy.resources.limits.memory`)
- Healthchecks for every service
- Pin image versions (`postgres:16-bookworm`, not `:latest`)

## Nginx
```nginx
# Security headers
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
limit_req zone=api burst=50 nodelay;

# Size limits
client_max_body_size 50M;
```
