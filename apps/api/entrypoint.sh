#!/bin/sh
set -e

cd /app/apps/api
node_modules/.bin/prisma migrate deploy
node /app/dist/apps/api/prisma/seed.js

exec node /app/dist/apps/api/main
