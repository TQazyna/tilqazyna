FROM php:8.2-cli-alpine

# System deps
RUN apk add --no-cache \
    bash \
    curl \
    git \
    oniguruma-dev \
    sqlite \
    sqlite-dev \
    nodejs \
    npm \
    $PHPIZE_DEPS

# PHP extensions
RUN docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_sqlite \
        mbstring

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html/sites/tilqazyna.kz

# Install Node dependencies and build assets
COPY ./sites/tilqazyna.kz/package.json ./sites/tilqazyna.kz/package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY ./sites/tilqazyna.kz ./
RUN npm run build

EXPOSE 8080

# No custom entrypoint; runtime handled by docker-compose command
CMD ["php", "-v"]

