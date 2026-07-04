FROM node:22-alpine AS builder

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json turbo.json ./
COPY apps/api/package.json apps/api/
COPY packages/ packages/

# Install all dependencies
RUN npm ci

# Copy source
COPY apps/api apps/api

# Generate Prisma client and build
WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

# Copy built artifacts
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy entrypoint
COPY apps/api/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

ENV NODE_ENV=production
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/api/v1', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

ENTRYPOINT ["./docker-entrypoint.sh"]
