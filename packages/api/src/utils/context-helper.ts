import { IContext } from '@etimo-achievements/service';
import httpContext from 'express-http-context';

export function getContext(): IContext {
  return httpContext.get('context') as IContext;
}
