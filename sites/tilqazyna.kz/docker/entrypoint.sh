#!/usr/bin/env sh
set -e

cd /var/www/html/sites/tilqazyna.kz

# Ensure storage and bootstrap are writable
mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache || true
chmod -R ug+rw storage bootstrap/cache || true

# Install PHP deps if vendor is missing (skip dev to avoid PHP 8.3-only dev deps)
if [ ! -d vendor ]; then
  composer install --no-dev --no-interaction --prefer-dist --no-progress
fi

# Ensure .env exists; copy from .env.docker if present, else generate minimal one
if [ ! -f .env ]; then
  if [ -f .env.docker ]; then
    cp .env.docker .env
  else
    cat > .env <<'EOF'
APP_NAME="Tilqazyna"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/sites/tilqazyna.kz/database/database.sqlite

FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
CACHE_STORE=file
SESSION_DRIVER=file
SESSION_LIFETIME=120
EOF
  fi
fi

# Generate key if not set
php artisan key:generate --force || true

# Ensure sqlite database file exists
mkdir -p database
touch database/database.sqlite
php artisan migrate --force || true

exec "$@"

