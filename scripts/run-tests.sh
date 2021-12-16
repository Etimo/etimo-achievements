#!/bin/bash

DB_NAME="achievements_ci"

main() {
  (build_packages \
  && start_postgres \
  && create_database \
  && migrate_database \
  && seed_database \
  && run_unit_tests \
  && run_integration_tests \
  && echo "Tests passed") || { echo "Tests failed"; exit 1; }
}

build_packages() {
  echo "Building packages"
  cd "$_script_path" || exit 1
  yarn build
}

start_postgres() {
  "$_script_path/start-postgres.sh"
}

create_database() {
  echo "Dropping database '$DB_NAME'"
  pg_command "DROP DATABASE $DB_NAME"

  echo "Creating database '$DB_NAME'"
  pg_command "CREATE DATABASE $DB_NAME"
}

pg_command() {
  docker exec -it -e PGPASSWORD=root achievements-pg psql -U root -c "$*"
}

migrate_database() {
  echo "Migrating database"
  (cd "$_root_path/packages/data" || return 1
  DB_NAME="$DB_NAME" npm run knex:test migrate:latest)
}

seed_database() {
  echo "Seeding database"
  (cd "$_root_path/packages/data" || return 1
  DB_NAME="$DB_NAME" npm run knex:test seed:run)
}

run_unit_tests() {
  echo "Running unit tests"
  npm run test
}

run_integration_tests() {
  echo "Running integration tests"
  npm run test-integration
}

# Setup paths
_script_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_root_path="$_script_path/.."

main
