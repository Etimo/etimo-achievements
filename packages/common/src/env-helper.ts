export function isLocal(): boolean {
  return !isProduction() && !isDevelopment();
}

export function isDevelopment(): boolean {
  return nodeEnv() === 'development';
}

export function isProduction(): boolean {
  return nodeEnv() === 'production';
}

export function nodeEnv(): string {
  if (process !== undefined && process.env !== undefined && process.env.NODE_ENV !== undefined) {
    const env = process.env.NODE_ENV.toLowerCase();
    return assertValidEnv(env);
  }

  return 'local';
}

function assertValidEnv(env: string): string {
  switch (env) {
    case 'local': // Local development
    case 'development': // Development on e.g. Docker or a local server
    case 'production': // Production environment (staging/production)
      return env;

    default:
      throw new Error(`Invalid environment: ${env}`);
  }
}
