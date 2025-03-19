#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
until PGPASSWORD=postgres psql -h postgres -U postgres -d ptera_test -c '\q'; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - initializing database"
cd nextjs

# Initialize database
if [ -f ../bun.lockb ]; then
  bun run db:init
  bun run db:seed
else
  npm run db:init
  npm run db:seed
fi

# Start Next.js server in the background
echo "Starting Next.js server for API testing..."
if [ -f ../bun.lockb ]; then
  bun run start:test &
else
  npm run start:test &
fi

# Store the PID of the Next.js server
NEXT_PID=$!

# Wait for the server to be ready
echo "Waiting for Next.js server to be ready..."
sleep 10

# Run integration tests
echo "Running integration tests"
if [ -f ../bun.lockb ]; then
  bun run test:integration
else
  npm run test:integration
fi

# Capture the exit code of the tests
TEST_EXIT_CODE=$?

# Kill the Next.js server
kill $NEXT_PID

echo "Tests completed with exit code $TEST_EXIT_CODE"
exit $TEST_EXIT_CODE
