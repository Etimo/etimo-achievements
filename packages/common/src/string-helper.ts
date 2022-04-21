export function toBase64(text: string): string {
  // Remove trailing = characters
  return Buffer.from(text).toString('base64').replace(/=+$/g, '');
}

export function fromBase64(text: string): string {
  // Add trailing = characters
  if (text.length % 4 > 0) {
    const missingPadding = 4 - (text.length % 4);
    text += '='.repeat(missingPadding);
  }

  return Buffer.from(text, 'base64').toString();
}

export function camelToSnakeCase(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
