import { isNumber } from './number-helper';

export function uniq<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function sort<T>(arr: T[], key: any, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...arr].sort(sortBy(key, order));
}

function sortBy(key: any, order: 'asc' | 'desc' = 'asc') {
  const orderA = order === 'asc' ? 1 : -1;
  const orderB = order === 'asc' ? -1 : 1;

  const getValue = (value: any) => {
    const keys = key.split('.');
    for (let i = 0; i < keys.length; i++) {
      value = value[keys[i]];
    }

    if (isNumber(value)) {
      const number = `${value}`.match(/^([0-9 ]+)/);
      if (number) {
        return parseInt(number[0].replace(' ', ''));
      }
      return value;
    }

    return `${value}`.toLowerCase();
  };

  return (a: any, b: any) => (getValue(a) > getValue(b) ? orderA : getValue(b) > getValue(a) ? orderB : 0);
}
