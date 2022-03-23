import { ConfigurationError } from '.';

export enum Environment {
  Local = 'local',
  Development = 'development',
  Test = 'test',
  Staging = 'staging',
  Production = 'production',
}

export function getEnvironment(): Environment {
  // @ts-ignore
  const env = process?.env?.NODE_ENV?.toLowerCase();
  switch (env) {
    default:
      return Environment.Local;
    case Environment.Development:
    case Environment.Test:
    case Environment.Staging:
    case Environment.Production:
      return env;
  }
}

export function isLocal(): boolean {
  return getEnvironment() === Environment.Local;
}

export function isDevelopment(): boolean {
  return getEnvironment() === Environment.Development;
}

export function isTest(): boolean {
  return getEnvironment() === Environment.Test;
}

export function isStaging(): boolean {
  return getEnvironment() === Environment.Staging;
}

export function isProduction(): boolean {
  return getEnvironment() === Environment.Production;
}

export function getEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new ConfigurationError(`Environment variable ${name} is not defined`);
  }
  return value;
}
