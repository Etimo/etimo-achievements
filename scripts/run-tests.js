import { getRootDirectory } from './utils/path-helper.js';
import runCommand from './utils/run-command.js';
import startPostgres from './utils/start-postgres.js';

const dbName = 'achievements_ci';
const rootDir = getRootDirectory();

async function runTests() {
  buildPackages();
  await startPostgres();
}

function buildPackages() {
  const success = runCommand('yarn', ['build'], rootDir);
  if (!success) {
    error('Build failed');
  }
}

function error(message) {
  console.error(message);
  process.exit(1);
}

/*
main() {
  && create_database \
  && migrate_database \
  && seed_database \
  && run_unit_tests \
  && run_integration_tests \
  && echo "Tests passed") || { echo "Tests failed"; exit 1; }
}

create_database() {
  echo "Dropping database '$DB_NAME'"
  pg_command "DROP DATABASE $DB_NAME"

  echo "Creating database '$DB_NAME'"
  pg_command "CREATE DATABASE $DB_NAME"
}

pg_command() {
  docker exec - it - e PGPASSWORD = root achievements - pg psql - U root - c "$*"
}

migrate_database() {
  echo "Migrating database"
    (cd "$_root_path/packages/data" || return 1
)

paths
_script_path = "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_root_path = "$_script_path/.."

main

*/
