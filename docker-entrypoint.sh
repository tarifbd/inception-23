#!/bin/sh
set -eu

database_path="/app/data/inception23.db"

if [ ! -f "$database_path" ]; then
  cp /app/bootstrap/dev.db "$database_path"
fi

exec "$@"
