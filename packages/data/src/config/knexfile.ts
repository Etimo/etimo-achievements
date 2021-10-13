module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      port: 5433,
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
};
