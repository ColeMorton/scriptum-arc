#!/bin/bash
# Setup Zixly local development environment

echo "🔧 Setting up Zixly local development environment..."

# Make scripts executable
chmod +x scripts/start-local.sh
chmod +x scripts/stop-local.sh
chmod +x scripts/restart-local.sh
chmod +x scripts/clean-local.sh

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    if [ -f "env.local.template" ]; then
        cp env.local.template .env.local
        echo "📝 Created .env.local from template. Please update with your values."
    else
        echo "❌ env.local.template not found. Please create .env.local manually."
        exit 1
    fi
fi

# Create necessary directories
mkdir -p letsencrypt init-scripts

echo "✅ Local development environment setup complete!"
echo ""
echo "🔧 Next steps:"
echo "  1. Update .env.local with your configuration"
echo "  2. Run ./scripts/start-local.sh to start the stack"
