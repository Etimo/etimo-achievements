export interface IFeatureService {
  isEnabled(feature: string): Promise<boolean>;
}
