import { sort } from './array-helper';

describe('sort', () => {
  test('should sort strings', () => {
    const obj = [
      {
        name: 'def',
      },
      {
        name: 'abc',
      },
      {
        name: 'ghi',
      },
    ];
    const sortedObj = sort(obj, 'name');
    expect(sortedObj[0].name).toBe('abc');
  });

  test('should sort strings case insensitive', () => {
    const obj = [
      {
        name: 'def',
      },
      {
        name: 'ABC',
      },
      {
        name: 'ghi',
      },
    ];
    const sortedObj = sort(obj, 'name');
    expect(sortedObj[0].name).toBe('ABC');
  });

  test('should sort strings case insensitive descending', () => {
    const obj = [
      {
        name: 'def',
      },
      {
        name: 'ABC',
      },
      {
        name: 'ghi',
      },
    ];
    const sortedObj = sort(obj, 'name', 'desc');
    expect(sortedObj[0].name).toBe('ghi');
  });

  test('should sort leading number sorting', () => {
    const obj = [
      {
        age: '10 000 st',
      },
      {
        age: '1 st',
      },
      {
        age: '100 st',
      },
    ];
    const sortedObj = sort(obj, 'age', 'desc');
    expect(sortedObj[0].age).toBe('10 000 st');
  });

  test('should sort numbers', () => {
    const obj = [
      {
        age: 100,
      },
      {
        age: 50,
      },
      {
        age: 2,
      },
    ];
    const sortedObj = sort(obj, 'age', 'asc');
    expect(sortedObj[0].age).toBe(2);
  });
});
