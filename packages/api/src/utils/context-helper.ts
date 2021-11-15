import { Context } from '@etimo-achievements/common';
import httpContext from 'express-http-context';

export function getContext(): Context {
  return httpContext.get('context') as Context;
}
