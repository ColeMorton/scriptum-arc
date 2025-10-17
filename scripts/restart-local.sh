#!/bin/bash
# Restart Zixly local development stack

echo "🔄 Restarting Zixly local stack..."

./scripts/stop-local.sh
sleep 5
./scripts/start-local.sh
