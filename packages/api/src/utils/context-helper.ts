import { IContext } from '@etimo-achievements/types';
import httpContext from 'express-http-context';

export function getContext(): IContext {
  return httpContext.get('context') as IContext;
}
