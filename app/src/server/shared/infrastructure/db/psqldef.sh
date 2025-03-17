#!/bin/bash

# psqldef の存在確認
if !(type psqldef > /dev/null 2>&1); then
    echo "psqldef が存在しません。 https://github.com/sqldef/sqldef?tab=readme-ov-file#installation"
    exit 1
fi

THIS_DIR=$(cd $(dirname $0); pwd)
FILE=$THIS_DIR/init.sql
CONGI_FILE=$THIS_DIR/sqldef-config.yaml


if [ -z "$DATABASE_HOST" ] || [ -z "$DATABASE_PORT" ] || [ -z "$DATABASE_NAME" ] || [ -z "$DATABASE_USER" ] || [ -z "$DATABASE_PASSWORD" ]; then
    echo "必要な環境変数が設定されていません。direnv が .env ファイルを読み込んでいることを確認してください。"
    exit 1
fi


if [ "$1" = "--dry-run" ] || [ "$1" = "-d" ]; then
    echo "dry-run mode"
   PGPASSWORD=$DATABASE_PASSWORD psqldef -f $FILE $DATABASE_NAME -U $DATABASE_USER \
    -h $DATABASE_HOST -p $DATABASE_PORT --skip-view --skip-extension --config="$CONGI_FILE" --before-apply="CREATE SCHEMA IF NOT EXISTS public; SET search_path TO public;" --dry-run
else
    echo "execution mode"
    read -p "are you sure? (y/n): " confirm
    if [ "$confirm" = "y" ]; then
         PGPASSWORD=$DATABASE_PASSWORD psqldef -f $FILE $DATABASE_NAME -U $DATABASE_USER \
            -h $DATABASE_HOST -p $DATABASE_PORT --skip-view --skip-extension --config="$CONGI_FILE" --before-apply="CREATE SCHEMA IF NOT EXISTS public; SET search_path TO public;"
        bun drizzle-kit pull
        echo "スキーマ変更が適用されました"
    else
        echo "キャンセルされました"
        exit 0
    fi
fi
