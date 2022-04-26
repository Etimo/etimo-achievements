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

    return UnleashFeatureService.getUnleash().isEnabled(feature, context);
  }

  private static getUnleash(): Unleash {
    if (!this.unleash) {
      this.unleash = initialize({
        url: getEnvVariable(Env.UNLEASH_URL),
        appName: 'etimo-achievements',
        environment: isProduction() ? 'production' : 'development',
        customHeaders: { Authorization: getEnvVariable(Env.UNLEASH_TOKEN) },
      });
    }

    return this.unleash;
  }
}
