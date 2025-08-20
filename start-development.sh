#!/bin/bash

echo "🚀 Starting Windows Ad Kit Development Environment"
echo "================================================"

# Start MCP servers
echo "📡 Starting AI enhancement servers..."
.mcp/launch.sh

# Start database
echo "💾 Starting database..."
supabase start

# Start development server
echo "🖥️  Starting application..."
npm run dev &

# Start Playwright UI
echo "🧪 Starting test interface..."
npm run test:watch &

# Ready for collaboration
echo ""
echo "✅ Windows Ad Kit is ready!"
echo ""
echo "🌐 Application: http://localhost:3000"
echo "🧪 Tests: http://localhost:9323"
echo "💬 Claude Code: Ready for collaboration"
echo ""
echo "Start with: 'Hello Claude, let's help contractors book appointments!'"
