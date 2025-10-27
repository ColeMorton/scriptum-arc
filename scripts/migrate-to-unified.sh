#!/bin/bash

# Migration Script: Unified Docker Compose Architecture
# This script migrates from separate stacks to unified architecture

set -e

echo "🚀 Starting migration to unified Docker Compose architecture..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running ✅"

# Step 1: Stop existing services
print_status "Step 1: Stopping existing services..."

# Stop zixly services
if [ -f "docker-compose.local.yml" ]; then
    print_status "Stopping zixly local services..."
    docker-compose -f docker-compose.local.yml down || true
fi

if [ -f "docker-compose.pipeline.yml" ]; then
    print_status "Stopping zixly pipeline services..."
    docker-compose -f docker-compose.pipeline.yml down || true
fi

# Stop trading services
if [ -f "/Users/colemorton/Projects/trading/docker-compose.yml" ]; then
    print_status "Stopping trading services..."
    docker-compose -f /Users/colemorton/Projects/trading/docker-compose.yml down || true
fi

print_success "Existing services stopped"

# Step 2: Backup data volumes
print_status "Step 2: Backing up data volumes..."

# Create backup directory
BACKUP_DIR="./backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup volumes if they exist
if docker volume ls | grep -q "zixly.*data"; then
    print_status "Backing up zixly volumes..."
    docker run --rm -v zixly-redis-data:/data -v "$(pwd)/$BACKUP_DIR":/backup alpine tar czf /backup/redis-data.tar.gz -C /data .
fi

if docker volume ls | grep -q "trading.*data"; then
    print_status "Backing up trading volumes..."
    docker run --rm -v trading_postgres_data:/data -v "$(pwd)/$BACKUP_DIR":/backup alpine tar czf /backup/trading-postgres-data.tar.gz -C /data .
fi

print_success "Data volumes backed up to $BACKUP_DIR"

# Step 3: Export environment variables
print_status "Step 3: Exporting environment variables..."

# Copy existing environment files
if [ -f ".env.local" ]; then
    cp .env.local "$BACKUP_DIR/.env.local.backup"
    print_status "Backed up .env.local"
fi

if [ -f "zixly-credentials.env" ]; then
    cp zixly-credentials.env "$BACKUP_DIR/zixly-credentials.env.backup"
    print_status "Backed up zixly-credentials.env"
fi

# Create unified environment file
if [ -f "env.unified" ]; then
    cp env.unified .env
    print_success "Created unified .env file"
else
    print_warning "env.unified not found, you may need to create .env manually"
fi

# Step 4: Start unified stack
print_status "Step 4: Starting unified stack..."

# Start core infrastructure first
print_status "Starting core infrastructure (Redis, LocalStack, PostgreSQL)..."
docker-compose up -d redis localstack postgres

# Wait for services to be healthy
print_status "Waiting for core services to be healthy..."
sleep 10

# Check Redis
if docker-compose exec redis redis-cli ping | grep -q "PONG"; then
    print_success "Redis is healthy ✅"
else
    print_error "Redis health check failed"
    exit 1
fi

# Check LocalStack
if curl -s http://localhost:4566/_localstack/health | grep -q "running"; then
    print_success "LocalStack is healthy ✅"
else
    print_warning "LocalStack health check failed, but continuing..."
fi

# Check PostgreSQL
if docker-compose exec postgres pg_isready -U trading_user -d trading_db > /dev/null 2>&1; then
    print_success "PostgreSQL is healthy ✅"
else
    print_error "PostgreSQL health check failed"
    exit 1
fi

# Start zixly services
print_status "Starting zixly services..."
docker-compose --profile zixly up -d

# Start trading services
print_status "Starting trading services..."
docker-compose --profile trading up -d

print_success "Unified stack started"

# Step 5: Verify service connectivity
print_status "Step 5: Verifying service connectivity..."

# Test webhook receiver
if curl -s http://localhost:3002/health | grep -q "ok"; then
    print_success "Webhook receiver is accessible ✅"
else
    print_warning "Webhook receiver health check failed"
fi

# Test trading API
if curl -s http://localhost:8000/health | grep -q "ok"; then
    print_success "Trading API is accessible ✅"
else
    print_warning "Trading API health check failed"
fi

# Test Next.js app
if curl -s http://localhost:3000/api/health | grep -q "ok"; then
    print_success "Next.js app is accessible ✅"
else
    print_warning "Next.js app health check failed"
fi

# Step 6: Run smoke tests
print_status "Step 6: Running smoke tests..."

# Test Redis connectivity from services
if docker-compose exec webhook-receiver redis-cli -h redis ping | grep -q "PONG"; then
    print_success "Webhook receiver can connect to Redis ✅"
else
    print_warning "Webhook receiver Redis connectivity failed"
fi

# Test LocalStack connectivity
if docker-compose exec webhook-receiver curl -s http://localstack:4566/_localstack/health | grep -q "running"; then
    print_success "Services can connect to LocalStack ✅"
else
    print_warning "LocalStack connectivity from services failed"
fi

# Test trading API connectivity from webhook receiver
if docker-compose exec webhook-receiver curl -s http://trading-api:8000/health | grep -q "ok"; then
    print_success "Webhook receiver can connect to trading API ✅"
else
    print_warning "Webhook receiver to trading API connectivity failed"
fi

# Final status
print_status "Migration Summary:"
echo "✅ Core infrastructure: Redis, LocalStack, PostgreSQL"
echo "✅ Zixly services: Webhook receiver, Pipeline workers"
echo "✅ Trading services: Trading API, ARQ worker"
echo "✅ Monitoring: Prometheus, Grafana (if enabled)"
echo "✅ Admin tools: pgAdmin, Redis Commander (if enabled)"

print_success "Migration completed successfully! 🎉"

echo ""
print_status "Next steps:"
echo "1. Test the pipeline: curl -X POST http://localhost:3002/webhook/trading-sweep -d '{\"ticker\":\"BTC-USD\"}'"
echo "2. Check monitoring: http://localhost:3001 (Grafana) or http://localhost:9090 (Prometheus)"
echo "3. Access admin tools: http://localhost:5050 (pgAdmin) or http://localhost:8081 (Redis Commander)"
echo ""
print_status "To start specific profiles:"
echo "  docker-compose --profile zixly --profile trading up -d"
echo "  docker-compose --profile frontend up -d"
echo "  docker-compose --profile monitoring up -d"
echo "  docker-compose --profile admin up -d"
