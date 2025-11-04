#!/bin/bash

echo "Setting up environment..."

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env file..."
    cat > backend/.env << 'EOF'
PORT=5000
NODE_ENV=development

# MongoDB Atlas connection - REPLACE WITH YOUR CONNECTION STRING
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cmx-platform

# JWT Configuration
JWT_SECRET=cmx-platform-secret-key-change-in-production
JWT_EXPIRE=30d

# CMX Configuration
CMX_TO_CENTS=10000
MIN_WITHDRAWAL=5000000
MAX_WITHDRAWAL=500000000

# Platform Settings
DEFAULT_PLATFORM_FEE=0.70
HOUSE_EDGE=0.05
EOF
    echo "✅ Created backend/.env"
    echo ""
    echo "⚠️  IMPORTANT: You need to update MongoDB URI in backend/.env"
    echo "   1. Go to https://www.mongodb.com/cloud/atlas"
    echo "   2. Create a free account and cluster"
    echo "   3. Get your connection string"
    echo "   4. Edit backend/.env and replace MONGODB_URI"
else
    echo "backend/.env already exists"
fi

# Create frontend .env if needed
if [ ! -f "frontend/.env" ]; then
    echo "Creating frontend/.env file..."
    cat > frontend/.env << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF
    echo "✅ Created frontend/.env"
fi

echo ""
echo "✅ Environment setup complete!"

