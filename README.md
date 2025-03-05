# Ptera


## プロジェクト構成

```
ptera/
├── .devcontainer/     # devcontainer
├── backend/           # Node.js バックエンド
└── frontend/          # Node.js/Reactフロントエンド
```

## 開発を始める

### Prerequisite

- [Visual Studio Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/products/docker-desktop)
- [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VS Code拡張機能

### 開発環境のセットアップ

1. VS Codeでプロジェクトを開く
2. コマンドパレットを開き、「Remote-Containers: Reopen in Container」を選択

### 開発環境での作業

```bash
# フロントエンドとバックエンドの両方を起動
dev

# バックエンドのみを起動
cd backend
bun run dev

# フロントエンドのみを起動
cd frontend
bun run dev
```

- バックエンドAPI: http://localhost:8000
- フロントエンドUI: http://localhost:3000

# マイグレーション
https://github.com/sqldef/sqldef

# 素材提供

https://ranuking.ko-me.com/
https://musmus.main.jp
