# テストの実行方法
Dockerを使用してAPIテストを実行する方法を説明します。

## 環境構成
以下のコンポーネントで構成されています：

1. PostgreSQLデータベースコンテナ
- テスト用の一時的なデータベース
2. APIテストコンテナ
- テストスイートを実行する環境
- プロジェクトコードをボリュームマウント

## 設定ファイル
プロジェクトルートディレクトリ:

```
docker-compose.test.yml - Docker Compose設定
Dockerfile.test - テスト用Dockerイメージの定義
.env.test - テスト環境の環境変数
```

実行方法
方法1: すべてをDockerで実行
```
# Docker環境内でテストを実行（ビルド→起動→テスト→終了）
npm run test:ci
```
方法2: DBのみDockerで実行し、テストはローカルで実行
```
# DBコンテナのみ起動
npm run test:docker:up
# マイグレーションとシードを実行
npm run db:migrate:test
npm run db:seed:test
# 終了時にDBコンテナを停止
npm run test:docker:down
```
方法2のステップをまとめて実行します。
```
# 環境起動→マイグレーション→シード→テスト実行→環境停止
npm run test:full
```
Docker環境を初期化：
```
# ボリュームも含めて完全に削除
npm run test:docker:clean
```
