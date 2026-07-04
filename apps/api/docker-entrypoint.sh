#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Generating Prisma client..."
npx prisma generate

echo "Starting application..."
exec node dist/main.js
