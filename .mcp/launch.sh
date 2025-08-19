#!/bin/bash
echo "🚀 Launching MCP servers for Windows Ad Kit..."

# Start Context7 for enhanced memory
npx -y @context7/mcp-server &

# Start Playwright for testing
npx -y @playwright/mcp-server &

# Start filesystem server
npx -y @modelcontextprotocol/server-filesystem &

echo "✅ MCP servers running. Claude Code now has enhanced capabilities."
