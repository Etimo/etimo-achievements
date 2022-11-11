import IORedis, { RedisOptions } from 'ioredis';

export type RedisClient = IORedis;
export type RedisConnection = RedisOptions;

type RedisLogger = typeof console.log;

export function getDefaultRedisClient(logger: RedisLogger = console.log): IORedis {
  return getRedisClient(process.env.REDIS_URL ?? 'redis://localhost:6379/0', logger);
}

export function getRedisClient(url: string, logger: RedisLogger): IORedis {
  const redis = getRedisConnection(url);

  redis.on('connect', () => logger('Connected to Redis'));
  redis.on('error', (error) => logger('Redis error', error));
  redis.on('reconnecting', (ms: number) => logger(`Reconnecting to Redis in ${ms} ms`));
  redis.on('close', () => logger('Disconnected from Redis'));

  return redis;
}

export function stopRedis(url: string): boolean {
  const connection = redisConnections.get(url);
  if (!connection) return false;

  try {
    connection.disconnect();
    redisConnections.delete(url);
    return true;
  } catch {
    return false;
  }
}

const redisConnections = new Map<string, IORedis>();

function getRedisConnection(url: string): IORedis {
  let connection = redisConnections.get(url);
  if (connection) return connection;

  console.log(`Creating redis connection to ${url}`);

  const redisOptions = {
    maxRetriesPerRequest: null,
    retryStrategy: (times: number) => Math.min(30, Math.pow(2, times)) * 1000,
  };
  connection = new IORedis(url, redisOptions);
  connection.setMaxListeners(50);

  redisConnections.set(url, connection);

  return connection;
}
