const getDbVariable = (name: string): string | undefined => {
  if (process.env.NODE_ENV === 'production') {
    return process.env['DB_ACHIEVEMENTS_LIVE_MAIN_' + name];
  }

  if (process.env.NODE_ENV === 'staging') {
    return process.env['DB_ACHIEVEMENTS_TEST_MAIN_' + name];
  }

  return process.env['DB_' + name];
};

const connection = {
  host: getDbVariable('PRIVATE_HOST') ?? '127.0.0.1',
  port: getDbVariable('PORT') ?? 5432,
  user: getDbVariable('USER') ?? 'root',
  password: getDbVariable('PASSWORD') ?? 'root',
  database: getDbVariable('NAME') ?? 'achievements_ci',
  ssl: process.env.NODE_ENV !== 'development' ? { rejectUnauthorized: false } : false,
};

if (process.env.DEBUG === 'true') {
  console.log(connection);
}

const fixedLocalhost = {
  client: 'postgresql',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'root',
    password: 'root',
    database: getDbVariable('NAME') ?? 'achievements',
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
