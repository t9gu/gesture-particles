#!/bin/bash

echo "🚀 Starting Gesture Particles dev server..."
echo "📍 Server will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

cd "$(dirname "$0")"

# Load nvm and use Node.js 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20 2>/dev/null

npm run dev
