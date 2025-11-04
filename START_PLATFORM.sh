#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Set paths to Node.js and add to PATH
NODE_BIN_DIR="$SCRIPT_DIR/nodejs/node-v20.10.0-darwin-arm64/bin"
export PATH="$NODE_BIN_DIR:$PATH"

echo "🎮 Starting CMX Earning & Gaming Platform..."
echo ""

# Kill any existing servers on these ports
echo "Checking for existing servers..."
lsof -ti :3001 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti :3000 2>/dev/null | xargs kill -9 2>/dev/null
sleep 1

echo "Starting Backend Server..."
cd "$SCRIPT_DIR/backend"
node server-json.js &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 3

echo "Starting Frontend Server..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started!"
echo ""
echo "🌐 Open http://localhost:3000 in your browser"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

wait
