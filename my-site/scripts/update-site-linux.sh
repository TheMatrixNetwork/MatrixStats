#!/usr/bin/env bash
set -euo pipefail

# Configurable via environment variables when invoking the script.
PROJECT_DIR="${PROJECT_DIR:-/opt/matrixsite/my-site}"
WEB_ROOT="${WEB_ROOT:-/srv/http/matrixsite}"
BACKEND_SERVICE="${BACKEND_SERVICE:-matrixsite-backend}"
PULL_LATEST="${PULL_LATEST:-1}"

# Safety guard: refuse to run if critical paths are missing or obviously wrong.
if [[ "$WEB_ROOT" == "/" || "$WEB_ROOT" == "/usr" || "$WEB_ROOT" == "/bin" ]]; then
  echo "FATAL: WEB_ROOT is set to a dangerous system path: $WEB_ROOT" >&2
  exit 1
fi

if [[ "$PROJECT_DIR" == "/" || "$PROJECT_DIR" == "/usr" ]]; then
  echo "FATAL: PROJECT_DIR is set to a dangerous system path: $PROJECT_DIR" >&2
  exit 1
fi

if [[ ! -f "$PROJECT_DIR/package.json" ]]; then
  echo "FATAL: package.json not found in PROJECT_DIR ($PROJECT_DIR). Wrong directory?" >&2
  exit 1
fi

log() {
  printf "[%s] %s\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: required command not found: $1" >&2
    exit 1
  fi
}

require_cmd npm
require_cmd rsync
require_cmd systemctl
require_cmd nginx

if [[ ! -d "$PROJECT_DIR" ]]; then
  echo "Error: project directory not found: $PROJECT_DIR" >&2
  exit 1
fi

if [[ ! -d "$WEB_ROOT" ]]; then
  echo "Error: web root not found: $WEB_ROOT" >&2
  exit 1
fi

log "Starting deploy"
log "Project dir: $PROJECT_DIR"
log "Web root: $WEB_ROOT"
log "Backend service: $BACKEND_SERVICE"

cd "$PROJECT_DIR"

if [[ "$PULL_LATEST" == "1" ]] && [[ -d .git ]]; then
  log "Pulling latest code"
  git pull --ff-only
fi

log "Installing dependencies"
npm ci

log "Building frontend"
npm run build

/srv/http/matrixsite/

log "Syncing dist to web root"
sudo rsync -av --delete dist/ "$WEB_ROOT/"

log "Restarting backend service"
sudo systemctl restart "$BACKEND_SERVICE"

log "Validating nginx config"
sudo nginx -t

log "Reloading nginx"
sudo systemctl reload nginx

log "Deploy complete"
