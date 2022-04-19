import { Logger } from '@etimo-achievements/common';
import { OAuthServiceFactory } from '@etimo-achievements/security';
import { CreateUserService, GetUserService } from '..';
import { IContext } from '../..';
import { CreateTokenService } from './create-token-service';
import { LoginResponse } from './types/login-response';

export class LoginService {
  private provider: string;
  private context: IContext;

  constructor(provider: string, context: IContext) {
    this.provider = provider;
    this.context = context;
  }

  public async login(code: string): Promise<LoginResponse> {
    // Get user from provider service
    const oauthService = OAuthServiceFactory.create(this.provider);
    const userInfo = await oauthService.getUserInfo(code);

    // Check if user exists in our store
    const getUserService = new GetUserService(this.context);
    let user = await getUserService.getByEmail(userInfo.email);

    // If user doesn't exist, create it
    if (!user) {
      Logger.log(`User ${userInfo.email} is not found. Creating a new user.`);
      const createUserService = new CreateUserService(this.context);
      user = await createUserService.create({
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

    const createTokenService = new CreateTokenService(this.context);
    return createTokenService.create(user, scopes);
  }
}
