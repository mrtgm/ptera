#!/bin/bash
# 開発サーバー起動スクリプト

# 色の設定
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 開発サーバーの起動ログ
echo -e "${BLUE}=======================================${NC}"
echo -e "${GREEN}🚀 Starting Ptera development servers...${NC}"
echo -e "${BLUE}=======================================${NC}"

# バックグラウンドプロセスを終了するための関数
function cleanup {
  echo -e "\n${YELLOW}⏱️  Shutting down services...${NC}"
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit 0
}

# Ctrl+Cが押されたときに全プロセスを終了
trap cleanup SIGINT

# バックエンドサーバーの起動
cd /workspace/backend
echo -e "${GREEN}🔧 Starting backend server...${NC}"
deno run --allow-net --allow-read --allow-env --allow-write --watch src/main.ts &
BACKEND_PID=$!

# 3秒待機してからフロントエンドを起動
sleep 3

# フロントエンドサーバーの起動
if [ -d "/workspace/frontend" ]; then
  cd /workspace/frontend
  if [ -f "package.json" ]; then
    echo -e "${GREEN}🎨 Starting frontend server...${NC}"
    npm run dev &
    FRONTEND_PID=$!
  else
    echo -e "${YELLOW}⚠️  Frontend package.json not found. Skipping frontend startup.${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Frontend directory not found. Skipping frontend startup.${NC}"
fi

echo -e "${GREEN}✅ Development servers are running!${NC}"
echo -e "${BLUE}=======================================${NC}"
echo -e "${YELLOW}Backend:${NC} http://localhost:8000"
echo -e "${YELLOW}Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}=======================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"

# メインプロセスが終了しないようにする
wait
