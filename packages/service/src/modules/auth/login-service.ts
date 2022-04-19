import { Logger } from '@etimo-achievements/common';
import { IOAuthService, OAuthServiceFactory } from '@etimo-achievements/security';
import { CreateUserService, GetUserService, ServiceOptions } from '..';
import { CreateTokenService } from './create-token-service';
import { LoginResponse } from './types/login-response';

export class LoginService {
  private oauthService: IOAuthService;
  private getUserService: GetUserService;
  private createUserService: CreateUserService;
  private createTokenService: CreateTokenService;

  constructor(provider: string, options: ServiceOptions) {
    this.oauthService = OAuthServiceFactory.create(provider);
    this.getUserService = new GetUserService(options);
    this.createUserService = new CreateUserService(options);
    this.createTokenService = new CreateTokenService(options);
  }

  public async login(code: string): Promise<LoginResponse> {
    // Get user from provider service
    const userInfo = await this.oauthService.getUserInfo(code);

    // Check if user exists in our store
    let user = await this.getUserService.getByEmail(userInfo.email);

    // If user doesn't exist, create it
    if (!user) {
      Logger.log(`User ${userInfo.email} is not found. Creating a new user.`);
      user = await this.createUserService.create({
        name: userInfo.name,
        email: userInfo.email,
      });
    }

    let scopes = ['cru:achievements', 'cru:awards', 'r:users', 'ru:profile', 'r:highscore'];

    // Administrator rights for certain users
    const isAdmin = userInfo.email === 'niclas.lindstedt@etimo.se';
    if (isAdmin) {
      scopes = ['a:achievements', 'a:awards', 'a:users', 'a:profile', 'a:highscore'];
    }

    return this.createTokenService.create(user, scopes);
  }
}
