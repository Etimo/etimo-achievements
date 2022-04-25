import { getEnvVariable } from '@etimo-achievements/common';
import { Env } from '@etimo-achievements/types';
import fetch from 'node-fetch';
import { IContext } from '../../context';

export class GetFeaturesService {
  constructor(private context: IContext) {}

  public async get(): Promise<void> {
    const unleashUrl = getEnvVariable(Env.UNLEASH_URL) + '/api/client/features';
    const unleashToken = getEnvVariable(Env.UNLEASH_TOKEN);

    const response = await fetch(unleashUrl, {
      headers: {
        'UNLEASH-APPNAME': 'default',
        Authorization: unleashToken,
        'Content-Type': 'application/json',
      },
    });

    // TODO: create a type for the response
    const body = (await response.json()) as any;

    // TODO: also create a dto and mapper in api part

    return body?.features ?? [];
  }
}
