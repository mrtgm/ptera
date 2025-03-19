#!/bin/sh
set -e

echo "$(date '+%Y-%m-%d %H:%M:%S') - Waiting for PostgreSQL to be ready..."
until PGPASSWORD=postgres psql -h db -U postgres -d ptera_test -c '\q'; do
  echo "$(date '+%Y-%m-%d %H:%M:%S') - PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "$(date '+%Y-%m-%d %H:%M:%S') - PostgreSQL is ready!"

echo "PostgreSQL is up - initializing database"
cd nextjs

# Initialize database
bun run db:migrate
bun run db:seed

# Start Next.js server in the background
echo "Starting Next.js server for API testing..."
bun run start:test

# Store the PID of the Next.js server
NEXT_PID=$!

# Wait for the server to be ready
echo "Waiting for Next.js server to be ready..."
sleep 10


# Capture the exit code of the tests
TEST_EXIT_CODE=$?

# Kill the Next.js server
kill $NEXT_PID

echo "Tests completed with exit code $TEST_EXIT_CODE"
exit $TEST_EXIT_CODE
