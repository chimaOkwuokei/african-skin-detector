#!/usr/bin/env bash
# Starts the backend and frontend together for local development.
#
#   --reset     wipe the database and uploads first, then start
#   --backend   backend only
#   --frontend  frontend only
#
# Run as ./dev.sh on macOS, Linux, and Git Bash.
# From the Windows cmd prompt or PowerShell, run dev.cmd instead.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

RESET=0
RUN_BACKEND=1
RUN_FRONTEND=1

for arg in "$@"; do
  case "$arg" in
    --reset)    RESET=1 ;;
    --backend)  RUN_FRONTEND=0 ;;
    --frontend) RUN_BACKEND=0 ;;
    -h|--help)  sed -n '2,10p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $arg (try --help)"; exit 1 ;;
  esac
done

# Adds the tool's usual install directory to PATH when the shell cannot
# already see it. A terminal opened before the tool was installed inherits
# the old PATH, so "not found" here often means "stale terminal" rather
# than "not installed".
find_tool() {
  local tool="$1"; shift
  command -v "$tool" >/dev/null 2>&1 && return 0
  local dir
  for dir in "$@"; do
    if [ -x "$dir/$tool" ] || [ -x "$dir/$tool.exe" ]; then
      PATH="$dir:$PATH"
      export PATH
      return 0
    fi
  done
  return 1
}

need_uv() {
  find_tool uv \
    "$HOME/.local/bin" \
    "$HOME/.cargo/bin" \
    "${LOCALAPPDATA:-$HOME/AppData/Local}/Programs/uv" \
    && return 0
  echo "Could not find uv."
  echo "Install it: https://docs.astral.sh/uv/getting-started/installation/"
  echo "If it is already installed, open a new terminal so PATH is picked up."
  exit 1
}

need_npm() {
  find_tool npm \
    "/c/Program Files/nodejs" \
    "$HOME/AppData/Roaming/npm" \
    "/usr/local/bin" \
    && return 0
  echo "Could not find npm."
  echo "Install Node.js: https://nodejs.org/"
  echo "If it is already installed, open a new terminal so PATH is picked up."
  exit 1
}

pids=()
cleanup() {
  echo ""
  echo "Shutting down..."
  for pid in "${pids[@]:-}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# The database has no migrations, so a schema change leaves an old file
# behind that errors on insert. Deleting it is the fix.
if [ "$RESET" = "1" ]; then
  echo "Resetting local data..."
  rm -f "$BACKEND"/*.db 2>/dev/null || true
  rm -rf "$BACKEND/uploads" 2>/dev/null || true

  # On Windows a running server keeps the file open, so the delete fails
  # silently and the stale schema survives. Say so rather than starting up
  # and failing later with a confusing insert error.
  if ls "$BACKEND"/*.db >/dev/null 2>&1; then
    echo ""
    echo "Could not delete the database: another process still has it open."
    echo "Stop any running server (check ports $BACKEND_PORT and $FRONTEND_PORT)"
    echo "and run ./dev.sh --reset again."
    exit 1
  fi
fi

port_busy() {
  # Returns success if something is already listening on the given port.
  # lsof covers macOS and most Linux; ss is the modern Linux tool; netstat
  # is the fallback and the only one of the three present in Git Bash.
  # The port is matched after either ":" (Linux, Windows) or "." (macOS).
  if command -v lsof >/dev/null 2>&1; then
    lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1
  elif command -v ss >/dev/null 2>&1; then
    ss -ltn 2>/dev/null | grep -qE "[:.]$1[[:space:]]"
  elif command -v netstat >/dev/null 2>&1; then
    netstat -an 2>/dev/null | grep -qE "[:.]$1[[:space:]].*LISTEN"
  else
    return 1  # can't tell, so let the server itself report the clash
  fi
}

check_port() {
  # $1 enabled, $2 port, $3 name, $4 env var to suggest
  [ "$1" = "1" ] || return 0
  port_busy "$2" || return 0
  echo "Port $2 is already in use, so the $3 cannot start."
  echo "Stop whatever is using it, or set $4 to another port."
  exit 1
}

check_port "$RUN_BACKEND" "$BACKEND_PORT" "backend" "BACKEND_PORT"
check_port "$RUN_FRONTEND" "$FRONTEND_PORT" "frontend" "FRONTEND_PORT"

if [ "$RUN_BACKEND" = "1" ]; then
  need_uv

  echo "Installing backend dependencies..."
  (cd "$BACKEND" && uv sync --quiet)

  if [ ! -f "$BACKEND/.env" ]; then
    echo "Note: backend/.env not found. MedGemma calls will fail with an auth"
    echo "      error until you copy .env.example to .env and fill it in."
  fi

  # Seeding is idempotent: it does nothing if specialists already exist.
  # Without at least one specialist, assigning a case returns 409.
  if [ -f "$BACKEND/scripts/seed_demo_data.py" ]; then
    (cd "$BACKEND" && uv run python scripts/seed_demo_data.py)
  fi

  echo "Starting backend on http://localhost:$BACKEND_PORT ..."
  # PYTHONIOENCODING keeps the Windows console from choking on the output.
  # uvicorn directly rather than `fastapi dev`, which crashes on Windows
  # when its output is not a terminal.
  (cd "$BACKEND" && PYTHONIOENCODING=utf-8 uv run uvicorn app.main:app \
      --reload --port "$BACKEND_PORT") &
  pids+=($!)
fi

if [ "$RUN_FRONTEND" = "1" ]; then
  need_npm

  if [ ! -d "$FRONTEND/node_modules" ]; then
    echo "Installing frontend dependencies..."
    (cd "$FRONTEND" && npm install)
  fi

  if [ ! -f "$FRONTEND/.env.local" ]; then
    echo "Note: frontend/.env.local not found. If the frontend reads the API"
    echo "      URL from the environment, add:"
    echo "      NEXT_PUBLIC_API_URL=http://localhost:$BACKEND_PORT"
  fi

  echo "Starting frontend on http://localhost:$FRONTEND_PORT ..."
  (cd "$FRONTEND" && npm run dev -- --port "$FRONTEND_PORT") &
  pids+=($!)
fi

echo ""
echo "  Frontend  http://localhost:$FRONTEND_PORT"
echo "  API       http://localhost:$BACKEND_PORT"
echo "  API docs  http://localhost:$BACKEND_PORT/docs"
echo ""
echo "Ctrl+C to stop."

wait
