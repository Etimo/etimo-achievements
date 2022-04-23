export function queryParam<T>(location: Location, property: string, defaultValue: T): T {
  const url = new URL(location.href);
  const strValue = url.searchParams.get(property);

  if (strValue && typeof defaultValue === 'number') return parseInt(strValue, 10) as unknown as T;
  if (strValue && typeof defaultValue === 'boolean') return !!strValue as unknown as T;

  return (strValue as unknown as T) ?? defaultValue;
}

export function removeQueryParam(location: Location, property: string): string {
  const url = new URL(location.href);
  url.searchParams.delete(property);
  return url.pathname + url.search;
}

export function addQueryParam(location: Location, property: string, value: string): string {
  const url = new URL(location.href);
  url.searchParams.append(property, value);
  return url.pathname + url.search;
}
