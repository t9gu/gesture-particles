#!/bin/bash

echo "🛑 Stopping Gesture Particles dev server..."

# Find and kill vite dev server process
pkill -f "vite" 2>/dev/null

# Also kill any process on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null

echo "✅ Server stopped"
