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

export function isUuidv4(text: string): boolean {
  return text.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i) !== null;
}
