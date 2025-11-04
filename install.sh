#!/bin/bash

echo "🚀 CMX Platform Installation Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "Please install Node.js first:"
    echo "1. Visit: https://nodejs.org/"
    echo "2. Download the LTS version for macOS"
    echo "3. Run the installer"
    echo "4. Then run this script again"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ -d "node_modules" ]; then
    echo "Backend dependencies already installed"
else
    npm install
fi
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
if [ -d "node_modules" ]; then
    echo "Frontend dependencies already installed"
else
    npm install
fi
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas"
echo "2. Create backend/.env file with your MongoDB connection string"
echo "3. Run: cd backend && npm run dev"
echo "4. In another terminal: cd frontend && npm run dev"
echo ""
echo "See START_HERE.md for detailed instructions"

