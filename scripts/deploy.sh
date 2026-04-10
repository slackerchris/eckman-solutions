#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"

usage() {
  cat <<'EOF'
Usage: npm run deploy -- [options]

Options:
  --create-admin           Create or update an admin user after deployment
  --admin-email EMAIL      Admin email for portal bootstrap
  --admin-password PASS    Admin password for portal bootstrap
  --admin-name NAME        Admin display name
  --no-build               Start existing images without rebuilding
  --help                   Show this message

Examples:
  npm run deploy
  npm run deploy -- --create-admin --admin-email owner@eckman.solutions --admin-password 'strong-password' --admin-name 'Owner'
EOF
}

require_command() {
  local command_name="$1"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Error: required command not found: $command_name" >&2
    exit 1
  fi
}

COMPOSE_ARGS=(up -d)
CREATE_ADMIN=false
ADMIN_EMAIL=""
ADMIN_PASSWORD=""
ADMIN_NAME="Portal Admin"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --create-admin)
      CREATE_ADMIN=true
      shift
      ;;
    --admin-email)
      ADMIN_EMAIL="${2:-}"
      shift 2
      ;;
    --admin-password)
      ADMIN_PASSWORD="${2:-}"
      shift 2
      ;;
    --admin-name)
      ADMIN_NAME="${2:-}"
      shift 2
      ;;
    --no-build)
      COMPOSE_ARGS=(up -d)
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      COMPOSE_ARGS=(up --build -d)
      if [[ "$1" != "--no-build" ]]; then
        echo "Error: unknown option $1" >&2
        usage >&2
        exit 1
      fi
      ;;
  esac
done

if [[ " ${COMPOSE_ARGS[*]} " != *" --build "* ]]; then
  COMPOSE_ARGS=(up --build -d)
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: missing $ENV_FILE" >&2
  echo "Copy .env.example to .env and set real values before deploying." >&2
  exit 1
fi

require_command docker

if ! docker compose version >/dev/null 2>&1; then
  echo "Error: docker compose is required." >&2
  exit 1
fi

if [[ "$CREATE_ADMIN" == true ]]; then
  if [[ -z "$ADMIN_EMAIL" || -z "$ADMIN_PASSWORD" ]]; then
    echo "Error: --create-admin requires --admin-email and --admin-password." >&2
    exit 1
  fi
fi

echo "Deploying Eckman Solutions with Docker Compose..."
cd "$ROOT_DIR"
docker compose "${COMPOSE_ARGS[@]}"

echo "Deployment complete."

if [[ "$CREATE_ADMIN" == true ]]; then
  echo "Bootstrapping portal admin user..."
  docker compose exec -T app npm run user:create -- \
    --email "$ADMIN_EMAIL" \
    --password "$ADMIN_PASSWORD" \
    --name "$ADMIN_NAME" \
    --role ADMIN
  echo "Portal admin ready: $ADMIN_EMAIL"
fi

echo "App should now be available on the configured host and port."