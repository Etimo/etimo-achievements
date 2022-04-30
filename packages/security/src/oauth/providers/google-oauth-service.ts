import { getEnvVariable } from '@etimo-achievements/utils';
import { OAuth2Client } from 'google-auth-library';
import fetch from 'node-fetch';
import { IOAuthService, UserInfo } from '..';

export class GoogleOAuthService implements IOAuthService {
  private readonly oauth2Client: OAuth2Client;

  constructor() {
    const clientId = getEnvVariable('GOOGLE_CLIENT_ID');
    const clientSecret = getEnvVariable('GOOGLE_CLIENT_SECRET');
    const redirectUri = getEnvVariable('GOOGLE_REDIRECT_URI');
    this.oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
  }

  public getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
    });

    return url;
  }

  public async getUserInfo(code: string): Promise<UserInfo> {
    const { tokens, res } = await this.oauth2Client.getToken(code);
    if (res?.status !== 200 || !tokens?.id_token || !tokens?.access_token) {
      throw new Error(`Failed to get token: ${res?.status}`);
    }

    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.id_token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Failed to fetch user info: ${response.status}`);
    }

    const userInfo = (await response.json()) as UserInfo;

    return userInfo;
  }
}
