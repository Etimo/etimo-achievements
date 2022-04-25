import { OAuthServiceFactory } from '@etimo-achievements/security';
import { CreateUserService } from '..';
import { IContext } from '../..';
import { CreateTokenService } from './create-token-service';
import { LoginResponse } from './types/login-response';

export class LoginService {
  constructor(private provider: string, private context: IContext) {}

  public async login(code: string): Promise<LoginResponse> {
    const { logger } = this.context;

    const { repositories } = this.context;

    // Get user from provider service
    const oauthService = OAuthServiceFactory.create(this.provider);
    const userInfo = await oauthService.getUserInfo(code);

    // Check if user exists in our store
    let user = await repositories.user.findByEmail(userInfo.email);

    // If user doesn't exist, create it
    if (!user) {
      logger.debug(`User ${userInfo.email} is not found. Creating a new user.`);
      const createUserService = new CreateUserService(this.context);
      user = await createUserService.create({
        name: userInfo.name,
        email: userInfo.email,
      });
    }

    let scopes = ['cru:achievements', 'cru:awards', 'r:users', 'ru:profile', 'r:highscore', 'r:feature'];

    // Administrator rights for certain users
    const isAdmin = userInfo.email === 'niclas.lindstedt@etimo.se';
    if (isAdmin) {
      scopes = ['admin', 'a:achievements', 'a:awards', 'a:users', 'a:profile', 'a:highscore', 'a:feature'];
    }

    const createTokenService = new CreateTokenService(this.context);
    return createTokenService.create(user, scopes);
  }
}
