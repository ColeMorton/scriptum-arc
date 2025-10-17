#!/bin/bash

# Zixly n8n Startup Script
# This script starts the n8n automation stack for Zixly internal operations

set -e

echo "🚀 Starting Zixly n8n Automation Stack..."
echo "=========================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Navigate to project directory
cd "$(dirname "$0")/.."

echo "📁 Working directory: $(pwd)"

# Create necessary directories
echo "📂 Creating directories..."
mkdir -p n8n-workflows/internal
mkdir -p n8n-credentials
mkdir -p n8n-external-hooks

# Check if n8n is already running
if docker-compose -f docker-compose.n8n.yml ps | grep -q "Up"; then
    echo "⚠️  n8n services are already running."
    echo "🔄 Restarting services..."
    docker-compose -f docker-compose.n8n.yml down
fi

# Load credentials
echo "📋 Loading Zixly credentials..."
if [ -f "zixly-credentials.env" ]; then
    export $(cat zixly-credentials.env | grep -v '^#' | xargs)
    echo "✅ Credentials loaded"
else
    echo "❌ ERROR: zixly-credentials.env not found!"
    echo "Please copy zixly-credentials.env.template to zixly-credentials.env"
    echo "and fill in your actual credential values."
    exit 1
fi

# Validate required credentials
echo "🔐 Validating required credentials..."
required_vars=("N8N_BASIC_AUTH_PASSWORD" "ZIXLY_EMAIL_PASSWORD" "POSTGRES_PASSWORD")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ ERROR: $var is not set in zixly-credentials.env"
        exit 1
    fi
done
echo "✅ All required credentials validated"

# Start n8n services
echo "🐳 Starting Docker containers..."
docker-compose -f docker-compose.n8n.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check n8n
echo "  - Checking n8n..."
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:5678/healthz > /dev/null 2>&1; then
        echo "    ✅ n8n is ready"
        break
    fi
    echo "    ⏳ Waiting for n8n... (attempt $attempt/$max_attempts)"
    sleep 2
    attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
    echo "    ❌ n8n failed to start"
    echo "📋 Checking logs..."
    docker-compose -f docker-compose.n8n.yml logs n8n
    exit 1
fi

# Check PostgreSQL
echo "  - Checking PostgreSQL..."
if docker exec zixly-n8n-postgres pg_isready -U n8n > /dev/null 2>&1; then
    echo "    ✅ PostgreSQL is ready"
else
    echo "    ❌ PostgreSQL is not ready"
    exit 1
fi

# Check Redis
echo "  - Checking Redis..."
if docker exec zixly-n8n-redis redis-cli ping > /dev/null 2>&1; then
    echo "    ✅ Redis is ready"
else
    echo "    ❌ Redis is not ready"
    exit 1
fi

# Display service information
echo ""
echo "🎉 Zixly n8n Automation Stack is ready!"
echo "========================================"
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.n8n.yml ps
echo ""
echo "🌐 Access Information:"
echo "  - n8n Interface: http://localhost:5678"
echo "  - Username: admin"
echo "  - Password: zixly2025"
echo ""
echo "📁 Workflow Files:"
echo "  - Client Onboarding: n8n-workflows/internal/client-onboarding.json"
echo "  - Time Tracking Sync: n8n-workflows/internal/time-tracking-sync.json"
echo "  - Financial Reporting: n8n-workflows/internal/financial-reporting.json"
echo ""
echo "📚 Documentation:"
echo "  - Setup Guide: docs/tools/n8n-setup.md"
echo "  - Internal Operations: docs/operations/internal-operations-guide.md"
echo ""
echo "🔧 Useful Commands:"
echo "  - View logs: docker-compose -f docker-compose.n8n.yml logs -f"
echo "  - Stop services: docker-compose -f docker-compose.n8n.yml down"
echo "  - Restart services: docker-compose -f docker-compose.n8n.yml restart"
echo ""
echo "✅ Ready to configure workflows and credentials in n8n!"
