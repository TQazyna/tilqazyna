FROM php:8.2-cli-alpine

# System deps
RUN apk add --no-cache \
    bash \
    curl \
    git \
    oniguruma-dev \
    sqlite \
    sqlite-dev \
    $PHPIZE_DEPS

# PHP extensions
RUN docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_sqlite \
        mbstring

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html/sites/tilqazyna.kz

# Entrypoint to prepare the app when the container starts
COPY ./sites/tilqazyna.kz/docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php", "-v"]

