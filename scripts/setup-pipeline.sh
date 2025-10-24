#!/bin/bash

# Zixly Pipeline Setup Script
# Purpose: Automate initial setup of webhook-triggered data analysis pipeline
# Usage: ./scripts/setup-pipeline.sh

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        Zixly Pipeline Setup - DevOps Automation           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Docker is required but not installed.${NC}"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo -e "${RED}❌ Docker Compose is required but not installed.${NC}"; exit 1; }
command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ Node.js is required but not installed.${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}❌ npm is required but not installed.${NC}"; exit 1; }

echo -e "${GREEN}✅ All prerequisites installed${NC}"
echo ""

# Check .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
    echo "Creating from template..."
    cp .env.local.template .env.local
    echo -e "${YELLOW}📝 Please edit .env.local with your credentials before continuing${NC}"
    echo "Press Enter to continue after editing..."
    read
fi

# Check if Supabase is configured
if ! grep -q "supabase.co" .env.local; then
    echo -e "${YELLOW}⚠️  Supabase credentials not configured in .env.local${NC}"
    echo "Please add your Supabase credentials before continuing"
    exit 1
fi

echo -e "${GREEN}✅ Environment configuration found${NC}"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo -e "${GREEN}✅ Root dependencies installed${NC}"
echo ""

# Install webhook receiver dependencies
echo "📦 Installing webhook receiver dependencies..."
cd services/webhook-receiver
npm install
cd ../..
echo -e "${GREEN}✅ Webhook receiver dependencies installed${NC}"
echo ""

# Install pipeline worker dependencies
echo "📦 Installing pipeline worker dependencies..."
cd services/pipeline-worker
npm install
cd ../..
echo -e "${GREEN}✅ Pipeline worker dependencies installed${NC}"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate
echo -e "${GREEN}✅ Prisma client generated${NC}"
echo ""

# Run database migrations
echo "🗄️  Running database migrations..."
read -p "Run migrations now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma migrate dev --name add_pipeline_models
    echo -e "${GREEN}✅ Database migrations completed${NC}"
else
    echo -e "${YELLOW}⏭️  Skipping migrations (run 'npx prisma migrate dev' later)${NC}"
fi
echo ""

# Build Docker services
echo "🐳 Building Docker services..."
docker-compose -f docker-compose.pipeline.yml build
echo -e "${GREEN}✅ Docker services built${NC}"
echo ""

# Start services
echo "🚀 Starting pipeline services..."
docker-compose -f docker-compose.pipeline.yml up -d
echo -e "${GREEN}✅ Services started${NC}"
echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service health
echo "🏥 Checking service health..."

if curl -sf http://localhost:3000/health > /dev/null; then
    echo -e "${GREEN}✅ Webhook Receiver: healthy${NC}"
else
    echo -e "${RED}❌ Webhook Receiver: unhealthy${NC}"
fi

if curl -sf http://localhost:9090/-/healthy > /dev/null; then
    echo -e "${GREEN}✅ Prometheus: healthy${NC}"
else
    echo -e "${RED}❌ Prometheus: unhealthy${NC}"
fi

if curl -sf http://localhost:3001/api/health > /dev/null; then
    echo -e "${GREEN}✅ Grafana: healthy${NC}"
else
    echo -e "${RED}❌ Grafana: unhealthy${NC}"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  Setup Complete! 🎉                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Access your services:"
echo "   • Webhook API:    http://localhost:3000"
echo "   • Grafana:        http://localhost:3001 (admin/admin)"
echo "   • Prometheus:     http://localhost:9090"
echo "   • Redis Commander: http://localhost:8081 (if debug profile enabled)"
echo ""
echo "🧪 Test the pipeline:"
echo "   curl -X POST http://localhost:3000/webhook/trading-sweep \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{
      \"ticker\": \"BTC-USD\",
      \"fast_range\": [10, 15],
      \"slow_range\": [20, 25],
      \"step\": 5,
      \"min_trades\": 50,
      \"strategy_type\": \"SMA\"
    }'"
echo ""
echo "📊 Monitor logs:"
echo "   docker-compose -f docker-compose.pipeline.yml logs -f"
echo ""
echo "📖 Documentation:"
echo "   • Deployment Guide: ./DEPLOYMENT.md"
echo "   • Implementation Summary: ./IMPLEMENTATION_SUMMARY.md"
echo "   • Architecture Decisions: ./docs/architecture/decisions/"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"

