import { ConfigurationError } from '@etimo-achievements/common';
import { EnvVariable } from '@etimo-achievements/types';

export function getEnvVariable(name: EnvVariable, defaultValue?: string): string {
  const value = process.env[name];
  if (!value) {
    if (defaultValue) {
      console.debug(`Requested non-existant env variable ${name}, using default value: ${defaultValue}`);
      return defaultValue;
    }

    throw new ConfigurationError(`Environment variable ${name} is not defined`);
  }
  return value;
}
