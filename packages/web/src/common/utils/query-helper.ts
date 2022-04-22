export function queryParam<T>(location: Location, property: string, defaultValue: T): T {
  const url = new URL(location.href);
  const strValue = url.searchParams.get(property);

  if (strValue && typeof defaultValue === 'number') return parseInt(strValue, 10) as unknown as T;
  if (strValue && typeof defaultValue === 'boolean') return !!strValue as unknown as T;

  return (strValue as unknown as T) ?? defaultValue;
}
