#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Set paths to Node.js and add to PATH
NODE_BIN_DIR="$SCRIPT_DIR/nodejs/node-v20.10.0-darwin-arm64/bin"
export PATH="$NODE_BIN_DIR:$PATH"

BACKEND_URL="http://localhost:3001/api/health"
FRONTEND_URL="http://localhost:3000"

function wait_for_service() {
  local name="$1"
  local url="$2"
  local attempts=20

  for ((i=1; i<=attempts; i++)); do
    if curl -s --max-time 2 "$url" >/dev/null; then
      echo "✅ $name is responding at $url"
      return 0
    fi
    echo "⏳ Waiting for $name to respond... ($i/$attempts)"
    sleep 1
  done

  echo "❌ $name did not respond at $url"
  return 1
}

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

if wait_for_service "Backend" "$BACKEND_URL"; then
  echo "Starting Frontend Server..."
  cd "$SCRIPT_DIR/frontend"
  npm run dev >/tmp/cmx-frontend.log 2>&1 &
  FRONTEND_PID=$!

  if wait_for_service "Frontend" "$FRONTEND_URL"; then
    echo ""
    echo "🎉 Platform is ready!"
    echo "  • Backend → $BACKEND_URL"
    echo "  • Frontend → $FRONTEND_URL"
    echo ""
    echo "Logs:"
    tail -n 5 /tmp/cmx-frontend.log
    echo ""
    echo "Press Ctrl+C to stop both servers"
    echo ""

    trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM
    wait
  else
    echo "Stopping services due to frontend startup failure..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
  fi
else
  echo "Stopping services due to backend startup failure..."
  kill $BACKEND_PID 2>/dev/null
  exit 1
fi
