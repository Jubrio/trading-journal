FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

COPY . .
RUN composer dump-autoload --optimize \
    && php artisan config:clear

EXPOSE 10000

# Render sets $PORT; migrate then serve. Using artisan serve is fine for a
# portfolio-scale app; swap for php-fpm+nginx if traffic ever justifies it.
CMD php artisan migrate --force && php artisan serve --host 0.0.0.0 --port ${PORT:-10000}
