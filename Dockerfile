FROM php:8.2-apache

# Install required PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Enable mod_rewrite (for WordPress permalinks)
RUN a2enmod rewrite

# Install required tools and download WordPress
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /var/www/html

# Download and extract WordPress
RUN wget https://wordpress.org/latest.zip \
    && unzip latest.zip \
    && cp -r wordpress/* . \
    && rm -rf wordpress latest.zip

# Copy custom wp-config.php
COPY wp-config.php /var/www/html/wp-config.php

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html