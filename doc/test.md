# テストの実行方法
Dockerを使用してAPIテストを実行する方法を説明します。

## 環境構成

1. PostgreSQLコンテナ
2. APIコンテナ
- Next.js をビルド（`bun run build:test`）

API コンテナ起動時、下記が実行されます：
- Next.js の起動（`bun run start:test`）
- DBマイグレーション、シード
- [Bun test](https://bun.sh/docs/cli/test) で API のテスト実行

## 設定ファイル
プロジェクトルート：

```
docker-compose.test.yml - Docker Compose設定
Dockerfile.test - テスト用Dockerイメージの定義
.env.test - テスト用環境変数
```
Next.jsアプリケーションのルート：
```
/test/api.integration.test.ts - テストコード
```

## 実行方法
すべてをDockerで実行
```
# Docker環境内でテストを実行（ビルド→起動→テスト→終了）
npm run test:docker:ci
```

Docker環境を初期化：
```
# ボリュームも含めて完全に削除
npm run test:docker:clean
```
