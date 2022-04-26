import { getEnvVariable, isProduction } from '@etimo-achievements/common';
import { Env, IFeatureService, IRequestContext } from '@etimo-achievements/types';
import { initialize, Unleash } from 'unleash-client';

export class UnleashFeatureService implements IFeatureService {
  private static unleash?: Unleash;

  constructor(private context: IRequestContext) {}

  public async isEnabled(feature: string): Promise<boolean> {
    const context = {
      userId: this.context.userId,
      sessionId: this.context.refreshTokenId,
      remoteAddress: this.context.remoteAddress,
    };

    return this.getUnleash().isEnabled(feature, context);
  }

  private getUnleash(): Unleash {
    if (!UnleashFeatureService.unleash) {
      const settings = {
        url: getEnvVariable(Env.UNLEASH_URL),
        appName: 'default',
        environment: isProduction() ? 'production' : 'development',
        customHeaders: { Authorization: getEnvVariable(Env.UNLEASH_TOKEN) },
      };

      UnleashFeatureService.unleash = initialize(settings);
    }

    return UnleashFeatureService.unleash;
  }
}
