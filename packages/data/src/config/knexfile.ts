const connection = {
  host: process.env.DB_HOSTNAME,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

const fixedLocalhost = {
  client: 'postgresql',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'root',
    password: 'root',
    database: 'achievements',
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
  production,
};
