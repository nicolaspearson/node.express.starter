#!/bin/sh

MIGRATION_NAME=$1

export TYPEORM_CONNECTION="${TYPEORM_CONNECTION:-postgres}"
export TYPEORM_DATABASE="${TYPEORM_DATABASE:-express}"
export TYPEORM_HOST="${TYPEORM_HOST:-localhost}"
export TYPEORM_PASSWORD="${TYPEORM_PASSWORD:-masterkey}"
export TYPEORM_PORT="${TYPEORM_PORT:-5432}"
export TYPEORM_SYNCHRONIZE="${TYPEORM_SYNCHRONIZE:-false}"
export TYPEORM_USERNAME="${TYPEORM_USERNAME:-master}"
export TYPEORM_SCHEMA="${TYPEORM_SCHEMA:-public}"
export TYPEORM_ENTITIES="${TYPEORM_ENTITIES:-dist/src/db/entities/*.js}"
export TYPEORM_MIGRATIONS="${TYPEORM_MIGRATIONS:-dist/src/db/migrations/*.js}"
export TYPEORM_MIGRATIONS_DIR="${TYPEORM_MIGRATIONS_DIR:-src/db/migrations}"
export TYPEORM_MIGRATIONS_RUN="${TYPEORM_MIGRATIONS_RUN:-true}"
export TYPEORM_DROP_SCHEMA="${TYPEORM_DROP_SCHEMA:-true}"

wait_time=10

echo "Starting database"
yarn db:start
echo "Waiting $wait_time seconds for the database to start"
sleep $wait_time
echo "yarn db:migration:run $TYPEORM_ENTITIES"
yarn db:migration:run
echo "yarn db:migration:generate $MIGRATION_NAME"
yarn db:migration:generate "$MIGRATION_NAME"
