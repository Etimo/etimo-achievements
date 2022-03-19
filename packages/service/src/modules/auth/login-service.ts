import { Logger } from '@etimo-achievements/common';
import { IOAuthService, JwtService, OAuthServiceFactory } from '@etimo-achievements/security';
import { IAccessToken } from '@etimo-achievements/types';
import { CreateUserService, GetUserService } from '..';
import { AccessTokenService } from './access-token-service';

export class LoginService {
  private service: IOAuthService;

  constructor(provider: string) {
    this.service = OAuthServiceFactory.create(provider);
  }

  public async login(code: string): Promise<IAccessToken> {
    // Get user from provider service
    const userInfo = await this.service.getUserInfo(code);

    // Check if user exists in our store
    const userService = new GetUserService();
    let user = await userService.getByEmail(userInfo.email);

    // If user doesn't exist, create it
    if (!user) {
      Logger.log(`User ${userInfo.email} is not found. Creating a new user.`);
      const createUserService = new CreateUserService();
      user = await createUserService.create({
        name: userInfo.name,
        email: userInfo.email,
      });
    }

    // Create a token for the user
    const token = JwtService.create(user);

    // Store token in database
    const tokenService = new AccessTokenService();
    const createdToken = await tokenService.create(token);

    return createdToken;
  }
}
