import Api from '../../common/utils/api';

export class FeatureApi {
  private api = new Api();

  public get(featureName: string) {
    return this.api.get<boolean>(`/feature/${featureName}`);
  }
}
