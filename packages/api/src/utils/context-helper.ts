import httpContext from 'express-http-context';
import { IApiContext } from '../context';

export function getContext(): IApiContext {
  return httpContext.get('context') as IApiContext;
}
