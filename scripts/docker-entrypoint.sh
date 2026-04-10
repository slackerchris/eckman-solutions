#!/usr/bin/env sh

set -eu

echo "Applying database schema..."
node ./node_modules/prisma/build/index.js db push

if [ "${BOOTSTRAP_ADMIN:-false}" = "true" ]; then
  echo "Bootstrapping portal admin..."
  node scripts/bootstrap-admin.mjs
fi

echo "Starting application..."
exec node server.js