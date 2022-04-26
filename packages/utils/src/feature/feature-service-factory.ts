import { IFeatureService, IRequestContext } from '@etimo-achievements/types';
import { UnleashFeatureService } from './unleash-feature-service';

type FeatureTypes = 'unleash';

export class FeatureServiceFactory {
  public static create(type: FeatureTypes, context: IRequestContext): IFeatureService {
    switch (type) {
      case 'unleash':
        return new UnleashFeatureService(context);

      default:
        throw new Error(`Unknown FeatureService type: ${type}`);
    }
  }
}
