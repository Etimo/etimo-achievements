import { convertObjectKeysCamelToSnakeCase } from '.';

const a = {
  helloWorld: 'Goodbye',
  userId: 'd36c9b71-3e8c-4830-9ee1-591ede1f34fb',
};

describe('convertObjectKeysCamelToSnakeCase', () => {
  test('should not contain any camelCase', () => {
    const result = convertObjectKeysCamelToSnakeCase(a);
    expect(result.userId).toBe(undefined);
    expect(result.helloWorld).toBe(undefined);
  });

  test('should convert correctly', () => {
    const result = convertObjectKeysCamelToSnakeCase(a);
    expect(result.user_id).toBe('d36c9b71-3e8c-4830-9ee1-591ede1f34fb');
    expect(result.hello_world).toBe('Goodbye');
  });

  test('should do nothing on empty object', () => {
    const result = convertObjectKeysCamelToSnakeCase({});
    expect(Object.keys(result).length).toBe(0);
  });
});
