import { BadRequestError } from '@etimo-achievements/common';
import { OrderByOption } from '@etimo-achievements/types';

export function validateOrderBy(orderBy: OrderByOption[], isPropertyFunc: (property: string) => boolean) {
  for (const [key] of orderBy) {
    if (!isPropertyFunc(key)) {
      throw new BadRequestError(`Invalid orderBy key: ${key}`);
    }
  }
}
