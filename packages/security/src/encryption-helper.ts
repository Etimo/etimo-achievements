import { getEnvVariable } from '@etimo-achievements/common';
import { Env } from '@etimo-achievements/types';
import Cryptr from 'cryptr';

export function encrypt(data: any, key?: string): string {
  if (!key) {
    key = getEnvVariable(Env.JWT_SECRET);
  }

  if (typeof data !== 'string') {
    data = JSON.stringify(data);
  }

  const cryptr = new Cryptr(key);
  return cryptr.encrypt(data);
}

export function decrypt(encryptedData: string, key?: string): string {
  if (!key) {
    key = getEnvVariable(Env.JWT_SECRET);
  }

  const cryptr = new Cryptr(key);
  return cryptr.decrypt(encryptedData);
}

export function decryptAs<T>(encryptedData: string, key?: string): T {
  return JSON.parse(decrypt(encryptedData, key)) as T;
}
