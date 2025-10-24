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

# Check if required ports are available
check_port() {
    local port=$1
    local service=$2
    if lsof -i :$port > /dev/null 2>&1; then
        echo "❌ Port $port is already in use (required for $service)"
        echo "   Please stop the service using port $port or check for conflicts"
        exit 1
    fi
}

echo "🔍 Checking port availability..."
check_port 5433 "PostgreSQL"
check_port 6380 "Redis"
check_port 5678 "pipeline"
echo "✅ All required ports are available"

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

# Check pipeline
if curl -f -s http://localhost:5678/healthz > /dev/null; then
    echo "✅ pipeline is healthy"
else
    echo "❌ pipeline health check failed"
fi

# Note: Plane service commented out to avoid conflict with Trading API (port 8000)

echo "🎉 Zixly local stack is running!"
echo ""
echo "📋 Service URLs:"
echo "  - pipeline: http://localhost:5678"
echo "  - PostgreSQL: localhost:5433 (host port, container uses 5432)"
echo "  - Redis: localhost:6380 (host port, container uses 6379)"
echo "  - Trading API: http://localhost:8000 (separate stack)"
echo ""
echo "🔧 Next steps:"
echo "  1. Import Pipeline workflows from ./pipeline-workflows/internal/"
echo "  2. Configure Trading API credentials in Pipeline"
echo "  3. Test Pipeline workflows connecting to Trading API"
echo "  4. Access Pipeline at http://localhost:5678 with credentials from .env.local"
