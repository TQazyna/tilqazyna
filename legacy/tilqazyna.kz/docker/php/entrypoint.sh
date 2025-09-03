#!/usr/bin/env sh
set -eu

# Optional: if any code insists on 127.0.0.1:3306, forward to mysql service
if command -v socat >/dev/null 2>&1; then
  # Forward 127.0.0.1:3306 to mysql service
  (socat TCP4-LISTEN:3306,bind=127.0.0.1,fork,reuseaddr TCP4:mysql:3306 2>/dev/null &)
fi

# Ensure Yii writable directories exist and are owned by www-data
for d in \
  /app/frontend/web/assets \
  /app/backend/web/assets \
  /app/frontend/runtime \
  /app/backend/runtime \
  /app/frontend/runtime/logs \
  /app/backend/runtime/logs
do
  mkdir -p "$d" || true
done

chown -R www-data:www-data \
  /app/frontend/web/assets \
  /app/backend/web/assets \
  /app/frontend/runtime \
  /app/backend/runtime 2>/dev/null || true

find /app/frontend/web/assets /app/backend/web/assets /app/frontend/runtime /app/backend/runtime -type d -exec chmod 775 {} + 2>/dev/null || true

exec "$@"


