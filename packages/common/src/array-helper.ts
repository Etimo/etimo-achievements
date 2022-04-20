export function uniq<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function sort<T>(arr: T[], key: any, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...arr].sort(sortBy(key, order));
}

function sortBy(key: any, order: 'asc' | 'desc' = 'asc') {
  const orderA = order === 'asc' ? 1 : -1;
  const orderB = order === 'asc' ? -1 : 1;

  const getValue = (value: any, k: string) => {
    const keys = k.split('.');
    for (let i = 0; i < keys.length; i++) {
      value = value[keys[i]];
    }
    return `${value}`.toLowerCase();
  };

  return (a: any, b: any) =>
    getValue(a, key) > getValue(b, key) ? orderA : getValue(b, key) > getValue(a, key) ? orderB : 0;
}
