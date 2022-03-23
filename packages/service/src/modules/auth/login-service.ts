import { Logger, uuid } from '@etimo-achievements/common';
import { AccessTokenRepository, RefreshTokenRepository } from '@etimo-achievements/data';
import { encrypt, IOAuthService, JwtService, OAuthServiceFactory, randomPassword } from '@etimo-achievements/security';
import {
  IAccessToken,
  INewAccessToken,
  INewRefreshToken,
  IRefreshToken,
  IRefreshTokenData,
  JWT,
} from '@etimo-achievements/types';
import spacetime from 'spacetime';
import { CreateUserService, GetUserService, ServiceOptions } from '..';

export type LoginResponse = IAccessToken & {
  refreshTokenKey: string;
  refreshTokenId: string;
  signedToken: string;
};

export class LoginService {
  private service: IOAuthService;
  private accessTokenRepo: AccessTokenRepository;
  private refreshTokenRepo: RefreshTokenRepository;

  constructor(provider: string, options?: ServiceOptions) {
    this.service = OAuthServiceFactory.create(provider);
    this.accessTokenRepo = options?.accessTokenRepository ?? new AccessTokenRepository();
    this.refreshTokenRepo = options?.refreshTokenRepository ?? new RefreshTokenRepository();
  }

  public async login(code: string): Promise<LoginResponse> {
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
    const signedToken = JwtService.sign(token);
    const refreshTokenKey = randomPassword(64);
    const refreshToken = await this.createRefreshToken(createdToken, refreshTokenKey);

    return { ...createdToken, signedToken, refreshTokenId: refreshToken.id, refreshTokenKey };
  }

  public async createAccessToken(token: JWT): Promise<IAccessToken> {
    const newToken: INewAccessToken = {
      id: token.jti,
      userId: token.sub,
      disabled: false,
      expiresAt: new Date(token.exp * 1000),
      scopes: token.scope.split(' '),
    };

    const accessToken = await this.accessTokenRepo.create(newToken);

    Logger.log(`Stored access token for user ${newToken.userId}`);

    return accessToken;
  }

  public async createRefreshToken(token: IAccessToken, key: string): Promise<IRefreshToken> {
    const refreshTokenId = uuid();
    const data: IRefreshTokenData = {
      userId: token.userId,
      scopes: token.scopes,
    };
    const encryptedData = encrypt(data, key);

    const newRefreshToken: INewRefreshToken = {
      id: refreshTokenId,
      data: encryptedData,
      disabled: false,
      used: false,
      expiresAt: spacetime().add(30, 'day').toNativeDate(),
    };

    const refreshToken = await this.refreshTokenRepo.create(newRefreshToken);

    Logger.log(`Stored refresh token (${refreshToken.id}) for user ${data.userId}`);

    return refreshToken;
  }
}
