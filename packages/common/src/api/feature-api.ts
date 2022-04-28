import Api from './api';

export class FeatureApi {
  private api = new Api();

  public get(featureName: string) {
    return this.api.get<boolean>(`/feature/${featureName}`);
  }
}
