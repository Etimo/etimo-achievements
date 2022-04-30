import { getEnvVariable } from '@etimo-achievements/utils';
import CryptoJS from 'crypto-js';

export function encrypt(data: any, key?: string): string {
  if (!key) {
    key = getEnvVariable('JWT_SECRET');
  }

  if (typeof data !== 'string') {
    data = JSON.stringify(data);
  }

  return CryptoJS.AES.encrypt(data, key!).toString();
}

export function decrypt(encryptedData: string, key?: string): string {
  if (!key) {
    key = getEnvVariable('JWT_SECRET');
  }

  return CryptoJS.AES.decrypt(encryptedData, key!).toString(CryptoJS.enc.Utf8);
}

export function decryptAs<T>(encryptedData: string, key?: string): T {
  return JSON.parse(decrypt(encryptedData, key)) as T;
}
