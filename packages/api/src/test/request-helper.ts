import { getEnvVariable } from '@etimo-achievements/utils';
import supertest, { Test } from 'supertest';

const hook = (app: any, method = 'post') => {
  return (args: any) => (supertest(app) as any)[method](args).set({ 'X-Api-Key': getEnvVariable('API_KEY') }) as Test;
};

export const request = (app: any) => ({
  post: hook(app, 'post'),
  get: hook(app, 'get'),
  put: hook(app, 'put'),
  delete: hook(app, 'delete'),
});
