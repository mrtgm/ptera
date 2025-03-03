#!/bin/bash
echo "🚀 Setting up development environment..."

# パーミッション設定
chmod +x .devcontainer/start-dev.sh

# バックエンドの依存関係のキャッシュ
echo "📦 Caching backend dependencies..."
cd /workspace/backend && deno cache --reload src/main.ts

# フロントエンドの依存関係のインストール
if [ -f "/workspace/frontend/package.json" ]; then
  echo "📦 Installing frontend dependencies..."
  cd /workspace/frontend && npm install
fi

echo "✅ Development environment is ready!"
