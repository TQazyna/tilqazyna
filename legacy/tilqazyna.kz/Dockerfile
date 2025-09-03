FROM php:7.0-fpm

# Install system dependencies and PHP extensions commonly required by Yii2
# Debian stretch is EOL; use trusted archive sources and relax validity/signature checks
RUN printf "deb [trusted=yes] http://archive.debian.org/debian stretch main contrib non-free\n" > /etc/apt/sources.list \
    && printf "deb [trusted=yes] http://archive.debian.org/debian stretch-backports main contrib non-free\n" >> /etc/apt/sources.list \
    && printf 'Acquire::Check-Valid-Until "false";\nAcquire::AllowInsecureRepositories "true";\nAPT::Get::AllowUnauthenticated "true";\n' > /etc/apt/apt.conf.d/99no-check-valid-until \
    && apt-get -o Acquire::Check-Valid-Until=false -o Acquire::AllowInsecureRepositories=true update \
    && apt-get install -y --no-install-recommends \
        git \
        unzip \
        socat \
        iproute2 \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libicu-dev \
        zlib1g-dev \
        libzip-dev \
        libmcrypt-dev \
        libxml2-dev \
        libonig-dev \
        curl \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install -j$(nproc) \
        gd \
        mysqli \
        pdo_mysql \
        intl \
        zip \
        exif \
        opcache \
        mbstring \
        xml \
    && rm -rf /var/lib/apt/lists/*

# Copy composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# The source code will be mounted as a volume via docker-compose; no COPY here for preservation

# Expose default php-fpm port
EXPOSE 9000

# Legacy defaults and entrypoint to proxy 127.0.0.1:3306 to mysql service
COPY docker/php/legacy.ini /usr/local/etc/php/conf.d/zz-legacy.ini
COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]


