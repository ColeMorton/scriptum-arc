# Stage 1: Build
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy root package files and lock file
COPY package*.json ./
COPY package-lock.json ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copy workspace package files
COPY apps/backend/package*.json ./apps/backend/
COPY apps/backend/tsconfig*.json ./apps/backend/
COPY apps/backend/nest-cli.json ./apps/backend/
COPY packages/database/package*.json ./packages/database/
COPY packages/shared/package*.json ./packages/shared/

# Install all dependencies (including devDependencies for build)
RUN npm ci --legacy-peer-deps

# Copy workspace source code
COPY packages/ ./packages/
COPY apps/backend/src/ ./apps/backend/src/

# Generate Prisma client
RUN npm run db:generate

# Build backend
RUN npm run build:backend

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies for Prisma
RUN apk add --no-cache openssl

# Copy root package files and lock file
COPY package*.json ./
COPY package-lock.json ./

# Copy workspace package files
COPY apps/backend/package*.json ./apps/backend/
COPY packages/database/package*.json ./packages/database/
COPY packages/shared/package*.json ./packages/shared/

# Install production dependencies only
RUN npm ci --omit=dev --legacy-peer-deps --ignore-scripts

# Copy Prisma schema and generate client
COPY packages/database/prisma/ ./packages/database/prisma/
RUN cd packages/database && npx prisma generate

# Copy built application from builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Copy shared packages source (needed at runtime due to ts paths)
COPY --from=builder /app/packages/database/src ./packages/database/src
COPY --from=builder /app/packages/shared/src ./packages/shared/src

# Set working directory to backend
WORKDIR /app/apps/backend

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "-r", "tsconfig-paths/register", "dist/apps/backend/src/main"]
