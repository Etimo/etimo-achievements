import { uniq } from '@etimo-achievements/common';

export function mergeClasses(classes: string, className?: string) {
  const c1 = classes.split(' ');
  const c2 = className?.split(' ') ?? [];

  return uniq([...c1, ...c2]).join(' ');
}
