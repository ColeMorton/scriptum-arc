#!/bin/bash
# Start Zixly local development stack

set -euo pipefail

echo "🚀 Starting Zixly local development stack..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found. Please copy env.local.template to .env.local and configure."
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Create necessary directories
mkdir -p letsencrypt init-scripts

# Start the stack
echo "📦 Starting Docker Compose stack..."
docker-compose -f docker-compose.local.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# Check PostgreSQL
if docker exec zixly-postgres pg_isready -U zixly_admin -d zixly_main > /dev/null; then
    echo "✅ PostgreSQL is healthy"
else
    echo "❌ PostgreSQL health check failed"
fi

# Check Redis
if docker exec zixly-redis redis-cli ping > /dev/null; then
    echo "✅ Redis is healthy"
else
    echo "❌ Redis health check failed"
fi

# Check n8n
if curl -f -s http://localhost:5678/healthz > /dev/null; then
    echo "✅ n8n is healthy"
else
    echo "❌ n8n health check failed"
fi

# Check Plane
if curl -f -s http://localhost:8000/health > /dev/null; then
    echo "✅ Plane is healthy"
else
    echo "❌ Plane health check failed"
fi

echo "🎉 Zixly local stack is running!"
echo ""
echo "📋 Service URLs:"
echo "  - n8n: http://localhost:5678"
echo "  - Plane: http://localhost:8000"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo ""
echo "🔧 Next steps:"
echo "  1. Configure Plane workspace and generate API token"
echo "  2. Import Plane smoke test workflow in n8n"
echo "  3. Run smoke test to validate integration"
