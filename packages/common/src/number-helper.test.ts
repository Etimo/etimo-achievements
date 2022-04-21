const { isNumber } = require('./number-helper');

describe('isNumber', () => {
  test('should return true on a number', () => {
    expect(isNumber(55)).toBe(true);
  });

  test('should return true on a number string', () => {
    expect(isNumber('11')).toBe(true);
  });

  test('should return true on a number string with spaces', () => {
    expect(isNumber('11 000')).toBe(true);
  });

  test('should return true on a negative number', () => {
    expect(isNumber('-11')).toBe(true);
  });

  test('should return false on a string', () => {
    expect(isNumber('Hello this is a string.')).toBe(false);
  });

  test('should return false on a date', () => {
    expect(isNumber('2021-03-22T22:00:00.001Z')).toBe(false);
  });
});
