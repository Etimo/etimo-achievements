import { getEnvVariable } from '@etimo-achievements/common';

const connection = {
  host: getEnvVariable('DB_MAIN_PRIVATE_HOST', '127.0.0.1'),
  port: getEnvVariable('DB_MAIN_PORT', '5432'),
  user: getEnvVariable('DB_MAIN_USER', 'root'),
  password: getEnvVariable('DB_MAIN_PASSWORD', 'root'),
  database: getEnvVariable('DB_MAIN_NAME', 'achievements_ci'),
  ssl: getEnvVariable('NODE_ENV') !== 'development' ? { rejectUnauthorized: false } : false,
};

if (getEnvVariable('DEBUG', 'false') === 'true') {
  console.log(connection);
}

const fixedLocalhost = {
  client: 'postgresql',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'root',
    password: 'root',
    database: getEnvVariable('DB_MAIN_NAME', 'achievements'),
    ssl: false,
  },
  migrations: {
    directory: '../../migrations',
  },
  seeds: {
    directory: '../../seeds',
  },
};

const useEnv = {
  client: 'postgresql',
  connection,
  migrations: {
    directory: '../../migrations',
  },
  seeds: {
    directory: '../../seeds',
  },
};

const testEnv = {
  ...useEnv,
  connection: {
    ...useEnv.connection,
    database: 'achievements_ci',
  },
};

const production = {
  client: 'postgresql',
  connection: {
    ...connection,
    ssl: { rejectUnauthorized: false },
  },
  migrations: {
    directory: '../../migrations',
  },
};

module.exports = {
  local: fixedLocalhost,
  development: useEnv,
  test: testEnv,
  staging: production,
  production,
};
