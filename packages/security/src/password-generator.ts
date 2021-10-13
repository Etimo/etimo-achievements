import password from 'secure-random-password';

export function randomPassword(length: number = 32): string {
  return password.randomPassword({
    length,
    characters: [password.lower, password.upper, password.digits],
  });
}
