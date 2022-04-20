export function minutesSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / 1000 / 60);
}
