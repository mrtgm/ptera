if !(type psqldef > /dev/null 2>&1); then
    echo "psqldef が存在しません。 https://github.com/sqldef/sqldef?tab=readme-ov-file#installation"
    exit 1
fi

THIS_DIR=$(cd $(dirname $0); pwd)
FILE=$THIS_DIR/schema.sql

if [ "$1" = "--dry-run" ] || [ "$1" = "-d" ]; then
    echo "dry-run mode"
    psqldef -W postgres -f $FILE ptera -U postgres --dry-run
else
    echo "execution mode"
    read -p "are you sure? (y/n): " confirm
    if [ "$confirm" = "y" ]; then
        psqldef -W postgres -f $FILE ptera -U postgres -h localhost
        bun drizzle-kit pull
        echo "スキーマ変更が適用されました"
    else
        echo "キャンセルされました"
        exit 0
    fi
fi
