#!/bin/bash
# Clean Zixly local development stack (removes all data)

echo "🧹 Cleaning Zixly local stack (this will remove all data)..."

read -p "Are you sure? This will delete all local data. (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose -f docker-compose.local.yml down -v
    docker volume prune -f
    echo "✅ Local stack cleaned"
else
    echo "❌ Clean cancelled"
fi
