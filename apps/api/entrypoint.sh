#!/bin/sh
set -e

cd /app/apps/api
node_modules/.bin/prisma migrate deploy

exec node /app/dist/apps/api/main
