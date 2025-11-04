#!/bin/bash

# Set path to local Node.js installation
export PATH="$HOME/Desktop/cmx-earning-platform/nodejs/node-v20.10.0-darwin-arm64/bin:$PATH"

echo "Starting CMX Platform Frontend..."
echo "Node.js version: $(node --version)"
echo ""

cd frontend
npm run dev

