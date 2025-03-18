# Ptera

<img src="./doc/screenshot-top.png" alt="スクリーンショット・トップページ" width="800">
<img src="./doc/screenshot-player.jpeg" alt="スクリーンショット・詳細ページ" width="800">
<img src="./doc/screenshot-editor.png" alt="スクリーンショット・編集ページ" width="800">

## プロジェクト構成

```
ptera/
├── packages # クライアント/サーバで共用するコード
│   ├── schema # スキーマ定義
│   └── config # 定数
├── nextjs
│   └──src
│       ├── app # Next.jsアプリケーション
│       ├── client # クライアントサイドのコード
│       └── server # サーバーサイドのコード
├── terraform # インフラ構成
│   ├── env
│   │   ├── dev # 開発環境
│   │   └── prod # 本番環境
│   └── modules # モジュール
└── doc # ドキュメント
```

### Prerequisite
- [Bun](https://bun.sh/)
- [Node.js](https://nodejs.org/)
- [direnv](https://direnv.net/)
- [Terraform](https://www.terraform.io/)
- [Terragrunt](https://terragrunt.gruntwork.io/)
- [Vercel CLI](https://vercel.com/docs/cli)

依存関係のバージョンは `.tool-versions` ([asdf](https://asdf-vm.com/) を使用) に記載。

## 開発環境の構築
1. Vercel プロジェクトにリンクして`.env.local`ファイルを取得します。
   ```bash
   bunx vercel link
   bunx vercel env pull
   ```
2. 環境変数の設定
   ```bash
    direnv allow
    ```
3. 開発サーバーの起動
   ```bash
   bun run dev
   ```

# 素材

- https://ranuking.ko-me.com/
- https://musmus.main.jp
