#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/incarcareauto"
cd "$APP_DIR"

echo "==> Instalare dependențe..."
npm ci

echo "==> Build Next.js..."
npm run build

echo "==> Copiere static în standalone..."
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cp .env .next/standalone/.env

echo "==> Repornire PM2..."
pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js

echo "==> Gata. Verifică: pm2 status"
