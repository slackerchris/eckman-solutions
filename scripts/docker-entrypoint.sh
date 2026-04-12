#!/usr/bin/env sh

set -eu

echo "Checking data directory is writable..."
touch /app/data/.write-test && rm /app/data/.write-test || {
  echo "ERROR: /app/data is not writable. Mount a writable volume at /app/data."
  exit 1
}

echo "Applying database schema..."
npx prisma db push --accept-data-loss

if [ "${BOOTSTRAP_ADMIN:-false}" = "true" ]; then
  echo "Bootstrapping portal admin..."
  node scripts/bootstrap-admin.mjs
fi

echo "Starting application..."
exec node server.js