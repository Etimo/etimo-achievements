import Cryptr from 'cryptr';

export function encrypt(data: any, key?: string): string {
  if (!key) {
    key = getJwtSecret();
  }

  if (typeof data !== 'string') {
    data = JSON.stringify(data);
  }

  const cryptr = new Cryptr(key);
  return cryptr.encrypt(data);
}

export function decrypt(encryptedData: string, key?: string): string {
  if (!key) {
    key = getJwtSecret();
  }

  const cryptr = new Cryptr(key);
  return cryptr.decrypt(encryptedData);
}

export function decryptAs<T>(encryptedData: string, key?: string): T {
  return JSON.parse(decrypt(encryptedData, key)) as T;
}

function getJwtSecret(): string {
  return process.env.JWT_SECRET || 'secret';
}
