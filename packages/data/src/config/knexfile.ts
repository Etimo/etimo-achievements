const connection = {
  host: process.env.DB_HOSTNAME ?? '127.0.0.1',
  port: process.env.DB_PORT ?? 5432,
  user: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? 'root',
  database: process.env.DB_NAME ?? 'achievements_ci',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

const fixedLocalhost = {
  client: 'postgresql',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'root',
    password: 'root',
    database: process.env.DB_NAME ?? 'achievements',
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
  test: useEnv,
  production,
};
