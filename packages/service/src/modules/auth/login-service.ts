import { Logger } from '@etimo-achievements/common';
import { AccessTokenRepository } from '@etimo-achievements/data';
import {
  hashPassword,
  IOAuthService,
  JwtService,
  OAuthServiceFactory,
  randomPassword,
} from '@etimo-achievements/security';
import { IAccessToken, INewAccessToken, JWT } from '@etimo-achievements/types';
import { CreateUserService, GetUserService, ServiceOptions } from '..';

export class LoginService {
  private service: IOAuthService;
  private repo: AccessTokenRepository;

  constructor(provider: string, options?: ServiceOptions) {
    this.service = OAuthServiceFactory.create(provider);
    this.repo = options?.accessTokenRepository ?? new AccessTokenRepository();
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
    const token = JwtService.create(user, ['w:achievements', 'r:awards', 'rw:users']);

    // Store token in database
    const createdToken = await this.createAccessToken(token);

    return createdToken;
  }

  public async createAccessToken(token: JWT): Promise<IAccessToken> {
    const refreshToken = randomPassword(64);

    const newToken: INewAccessToken = {
      id: token.jti,
      userId: token.sub,
      refreshToken: await hashPassword(refreshToken),
      disabled: false,
      expiresAt: new Date(token.exp * 1000),
      scopes: token.scope.split(' '),
    };

    const accessToken = await this.repo.create(newToken);
    const signedToken = JwtService.sign(token);

    return { ...accessToken, signedToken, refreshToken };
  }
}
