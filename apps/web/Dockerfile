FROM node:22-alpine AS builder

WORKDIR /app

# Copy root workspace
COPY package.json package-lock.json turbo.json ./
COPY apps/web/package.json apps/web/
COPY packages/ packages/

# Install dependencies
RUN npm ci

# Copy source
COPY apps/web apps/web

# Build
WORKDIR /app/apps/web
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

# Copy standalone build
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/public ./public

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
