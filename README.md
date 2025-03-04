# Ptera


## プロジェクト構成

```
ptera/
├── .devcontainer/     # devcontainer
├── backend/           # Denoバックエンド
└── frontend/          # Node.js/Reactフロントエンド
```

## 開発を始める

### Prerequisite

- [Visual Studio Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/products/docker-desktop)
- [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VS Code拡張機能

### 開発環境のセットアップ

1. VS Codeでプロジェクトを開く
2. コマンドパレット（Ctrl+Shift+P / Cmd+Shift+P）を開き、「Remote-Containers: Reopen in Container」を選択
3. DevContainerのビルドと開始を待つ

### 開発環境での作業

開発コンテナ内では、以下のコマンドが利用可能です：

```bash
# フロントエンドとバックエンドの両方を起動
dev

# バックエンドのみを起動
cd backend
deno task dev

# フロントエンドのみを起動
cd frontend
npm run dev
```

### 利用可能なエンドポイント

- バックエンドAPI: http://localhost:8000
- フロントエンドUI: http://localhost:3000

# 素材提供

https://ranuking.ko-me.com/
https://musmus.main.jp
