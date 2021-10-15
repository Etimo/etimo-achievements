import { isDevelopment } from '@etimo-achievements/common';

const connection = {
  host: process.env.DB_HOSTNAME,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

if (isDevelopment()) {
  console.log('Database connection:', connection);
}

module.exports = {
  local: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'root',
      password: 'root',
      database: 'achievements',
    },
    migrations: {
      directory: '../../migrations',
    },
    seeds: {
      directory: '../../seeds',
    },
  },
  development: {
    client: 'postgresql',
    connection,
    migrations: {
      directory: '../../migrations',
    },
    seeds: {
      directory: '../../seeds',
    },
  },
  production: {
    client: 'postgresql',
    connection,
    migrations: {
      directory: '../../migrations',
    },
    ssl: true,
  },
};
