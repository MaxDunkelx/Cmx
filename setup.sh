#!/bin/bash

echo "🚀 CMX Platform Setup Script"
echo "============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p backend/{models,routes,middleware,controllers,config}
mkdir -p frontend/src/{components,pages,context,utils,assets}
echo "✅ Directories created"
echo ""

# Initialize Git
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
    echo ""
fi

# Setup Backend
echo "🔧 Setting up backend..."
cd backend
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken validator
npm install --save-dev nodemon
cd ..

# Setup Frontend
echo "🔧 Setting up frontend..."
cd frontend
npm create vite@latest . -- --template react
npm install axios react-router-dom
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create MongoDB Atlas account"
echo "2. Add connection string to backend/.env"
echo "3. Run: cd backend && npm run dev"
echo "4. Run: cd frontend && npm run dev"

