import loadEnvFile from './utils/load-env-file.js';
import { getPackageDirectory, getRootDirectory } from './utils/path-helper.js';
import runCommand from './utils/run-command.js';
import runPostgresCommand from './utils/run-postgres-command.js';
import startPostgres from './utils/start-postgres.js';

const dbName = 'achievements_ci';
const rootDir = getRootDirectory();

async function runTests() {
  loadEnvFile();
  await buildPackages();
  await startPostgres();
  createDatabase(dbName);
  await migrateDatabase(dbName);
  await seedDatabase(dbName);
  await runUnitTests();
  await runIntegrationTests();
}

async function buildPackages() {
  const success = await runCommand('yarn', ['build'], rootDir);
  if (!success) {
    error('Build failed');
  }
}

function createDatabase(dbName) {
  console.log(`Dropping database '${dbName}'`);
  runPostgresCommand(`DROP DATABASE ${dbName};`);

  console.log(`Creating database '${dbName}'`);
  runPostgresCommand(`CREATE DATABASE ${dbName};`);
}

async function migrateDatabase(dbName) {
  console.log('Migrating database');
  const cwd = getPackageDirectory('data');
  process.env.DB_NAME = dbName;
  const success = await runCommand('npm', ['run', 'knex:test', 'migrate:latest'], cwd);
  if (!success) {
    error('Migration of database failed');
  }
}

async function seedDatabase(dbName) {
  console.log('Seeding database');
  const cwd = getPackageDirectory('data');
  process.env.DB_NAME = dbName;
  const success = await runCommand('npm', ['run', 'knex:test', 'seed:run'], cwd);
  if (!success) {
    error('Seeding of database failed');
  }
}

async function runUnitTests() {
  console.log('Running unit tests');
  const success = await runCommand('npm', ['run', 'test']);
  if (!success) {
    error('Unit tests failed');
  }
}

async function runIntegrationTests() {
  console.log('Running integration tests');
  const success = await runCommand('npm', ['run', 'test-integration']);
  if (!success) {
    error('Integration tests failed');
  }
}

function error(message) {
  console.error(message);
  process.exit(1);
}

runTests();

/*
main() {
  && seed_database \
  && run_unit_tests \
  && run_integration_tests \
  && echo "Tests passed") || { echo "Tests failed"; exit 1; }
}

paths
_script_path = "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_root_path = "$_script_path/.."

main

*/
