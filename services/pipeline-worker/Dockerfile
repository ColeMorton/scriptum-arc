FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Prisma schema is already copied in the source code

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 worker

# Copy built application
COPY --from=builder --chown=worker:nodejs /app/dist ./dist
COPY --from=builder --chown=worker:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=worker:nodejs /app/package.json ./package.json

USER worker

# Worker doesn't expose ports but we add health check via file
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD test -f /tmp/worker-healthy || exit 1

CMD ["node", "dist/worker.js"]

