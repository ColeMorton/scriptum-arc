#!/bin/bash
# Stop Zixly local development stack

echo "🛑 Stopping Zixly local stack..."

docker-compose -f docker-compose.local.yml down

echo "✅ Zixly local stack stopped"
