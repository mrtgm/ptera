#!/bin/sh
set -e

# DB が立ち上がるまで待機
echo "$(date '+%Y-%m-%d %H:%M:%S') - Waiting for PostgreSQL to be ready..."
until PGPASSWORD=postgres psql -h db -U postgres -d ptera_test -c '\q'; do
  echo "$(date '+%Y-%m-%d %H:%M:%S') - PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "$(date '+%Y-%m-%d %H:%M:%S') - PostgreSQL is ready!"

echo "PostgreSQL is up - initializing database"
cd nextjs

bun run db:migrate
bun run db:seed

echo "Starting Next.js server for API testing..."
bun run start:test
