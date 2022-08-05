import { OAuthServiceFactory } from '@etimo-achievements/security';
import { CreateUserService, SyncSlackUsersService, UpdateUserService } from '..';
import { IContext } from '../..';
import { CreateUserTokenService } from './create-user-token-service';
import { LoginResponse } from './types/login-response';

export class LoginService {
  constructor(private provider: string, private context: IContext) {}

  public async login(code: string): Promise<LoginResponse> {
    const { logger } = this.context;

    const { repositories } = this.context;

    // Get user from provider service
    const oauthService = OAuthServiceFactory.create(this.provider);
    const userInfo = await oauthService.getUserInfo(code);

    const image = userInfo.picture.split('=')[0]; // remove the sizing options at the end of the url

    // Check if user exists in our store
    let user = await repositories.user.findByEmail(userInfo.email);
    // Get slack handle
    const slackHandle =
      user?.slackHandle ?? (await new SyncSlackUsersService(this.context).getUserSlackHandle(userInfo.email));

    // If user doesn't exist, create it
    if (!user) {
      logger.debug(`User ${userInfo.email} is not found. Creating a new user.`);
      const createUserService = new CreateUserService(this.context);
      user = await createUserService.create({
        name: userInfo.name,
        email: userInfo.email,
        slackHandle,
        image,
      });
    } else {
      // Update user's profile image
      logger.debug(`Updating ${user.email}'s profile picture.`);
      if (!user.slackHandle) user.slackHandle = slackHandle; // If user.slackHandle is null, updating below will fail
      await new UpdateUserService(this.context).update({ ...user, image });
    }

    let scopes = ['cru:achievements', 'cru:awards', 'r:users', 'ru:profile', 'r:highscore', 'r:feature', 'r:badges'];

    // Administrator rights for certain users
    const isAdmin = userInfo.email === 'niclas.lindstedt@etimo.se' || userInfo.email === 'axel.elmarsson@etimo.se';
    if (isAdmin) {
      scopes = ['admin', 'a:achievements', 'a:awards', 'a:users', 'a:profile', 'a:highscore', 'a:feature', 'a:badges'];
    }

    const createUserTokenService = new CreateUserTokenService(this.context);
    return createUserTokenService.create(user, scopes);
  }
}
