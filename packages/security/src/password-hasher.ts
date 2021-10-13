import bcrypt from 'bcrypt';

export function hashPassword(password: string): Promise<string> {
  const salt = generateSalt(10);
  return bcrypt.hash(password, salt);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function generateSalt(saltRounds: 10): string {
  const salt = bcrypt.genSaltSync(saltRounds);
  return salt;
}
