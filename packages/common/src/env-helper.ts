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
    return process.env.NODE_ENV.toLowerCase();
  }

  return 'local';
}
