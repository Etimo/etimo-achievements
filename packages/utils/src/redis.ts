import { ILogger } from '@etimo-achievements/types';
import IORedis, { RedisOptions } from 'ioredis';

export type RedisClient = IORedis;
export type RedisConnection = RedisOptions;

export const getRedisClient = (url: string, logger: ILogger): IORedis => {
  const redis = getRedisConnection(url);

  redis.on('connect', () => {
    logger.info('Connected to Redis');
  });

  redis.on('error', (error) => {
    logger.info('Redis error', { extras: { error } });
  });

  redis.on('reconnecting', (ms: number) => {
    logger.info(`Reconnecting to Redis in ${ms} ms`);
  });

  redis.on('close', () => {
    logger.info('Disconnected from Redis');
  });

  return redis;
};

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
