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
bun run start:test &
NEXT_PID=$!

# Wait for Next.js server to be ready by polling the health endpoint
echo "Waiting for Next.js server to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "Next.js server is ready!"
    break
  fi

  echo "Next.js server not ready yet, retrying in 2 seconds... (${RETRY_COUNT}/${MAX_RETRIES})"
  sleep 2
  RETRY_COUNT=$((RETRY_COUNT+1))
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "Next.js server failed to start within the timeout period!"
  kill $NEXT_PID
  exit 1
fi

# Now run the tests
echo "Running integration tests..."
bun run test:integration
TEST_EXIT_CODE=$?

# Clean up
echo "Shutting down Next.js server..."
kill $NEXT_PID

echo "Tests completed with exit code $TEST_EXIT_CODE"
exit $TEST_EXIT_CODE
