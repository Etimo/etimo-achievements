import { BadRequestError } from '@etimo-achievements/common';
import { GoogleOAuthService, IOAuthService, OAuthProvider } from '.';

export class OAuthServiceFactory {
  public static create(provider: string): IOAuthService {
    switch (provider) {
      case OAuthProvider.Google:
        return new GoogleOAuthService();

      default:
        throw new BadRequestError(`Unsupported OAuth provider: ${provider}`);
    }
  }
}
