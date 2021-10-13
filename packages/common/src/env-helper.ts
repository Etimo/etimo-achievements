export function isDevelopment(): boolean {
  return (
    process !== undefined &&
    process.env !== undefined &&
    process.env.NODE_ENV !== undefined &&
    process.env.NODE_ENV.toLowerCase() === 'development'
  );
}
