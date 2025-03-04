#!/bin/bash
echo "🚀 Setting up development environment..."

if [ -f "/workspace/backend/package.json" ]; then
  echo "📦 Installing backend dependencies..."
  cd /workspace/backend && npm install
fi

if [ -f "/workspace/frontend/package.json" ]; then
  echo "📦 Installing frontend dependencies..."
  cd /workspace/frontend && bun install
fi

echo "✅ Development environment is ready!"
