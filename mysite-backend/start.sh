#!/usr/bin/env bash
set -euo pipefail

# MatrixSite backend start helper.
#
# Replace the values in my-site.env before running this script.
# The script loads those variables, then starts the Node backend.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${MY_SITE_ENV_FILE:-$SCRIPT_DIR/my-site.env}"
NODE_BIN="${NODE_BIN:-node}"
APP_ENTRY="${APP_ENTRY:-$SCRIPT_DIR/server/index.js}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE" >&2
  echo "Copy my-site.env.example to my-site.env and replace the placeholder values." >&2
  exit 1
fi

# Export everything in the env file so the backend sees the same runtime values
# whether you start it manually or through systemd.
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ ! -f "$APP_ENTRY" ]]; then
  echo "Missing backend entrypoint: $APP_ENTRY" >&2
  exit 1
fi

exec "$NODE_BIN" "$APP_ENTRY"