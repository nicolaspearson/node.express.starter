#!/bin/sh

MIGRATION_NAME=$1

export DB_CONNECTION="${DB_CONNECTION:-postgres}"
export DB_DATABASE="${DB_DATABASE:-express}"
export DB_HOST="${DB_HOST:-localhost}"
export DB_PASSWORD="${DB_PASSWORD:-masterkey}"
export DB_PORT="${DB_PORT:-5432}"
export DB_SYNCHRONIZE="${DB_SYNCHRONIZE:-false}"
export DB_USERNAME="${DB_USERNAME:-master}"
export DB_SCHEMA="${DB_SCHEMA:-public}"
export DB_ENTITIES="${DB_ENTITIES:-dist/src/db/entities/*.js}"
export DB_MIGRATIONS="${DB_MIGRATIONS:-dist/src/db/migrations/*.js}"
export DB_MIGRATIONS_DIR="${DB_MIGRATIONS_DIR:-src/db/migrations}"
export DB_MIGRATIONS_RUN="${DB_MIGRATIONS_RUN:-true}"
export DB_DROP_SCHEMA="${DB_DROP_SCHEMA:-true}"

wait_time=10

echo "Starting database"
yarn db:start
echo "Waiting $wait_time seconds for the database to start"
sleep $wait_time
echo "yarn db:migration:run $DB_ENTITIES"
yarn db:migration:run
echo "yarn db:migration:generate $MIGRATION_NAME"
yarn db:migration:generate "$MIGRATION_NAME"
