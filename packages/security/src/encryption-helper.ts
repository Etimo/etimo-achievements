import Cryptr from 'cryptr';

export function encrypt(data: any, key: string): string {
  if (typeof data !== 'string') {
    data = JSON.stringify(data);
  }

  const cryptr = new Cryptr(key);
  return cryptr.encrypt(data);
}

export function decrypt<T>(encryptedData: string, key: string): T {
  const cryptr = new Cryptr(key);
  const decryptedData = cryptr.decrypt(encryptedData);
  return JSON.parse(decryptedData) as T;
}
