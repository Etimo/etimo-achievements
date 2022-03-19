import { UserInfo } from '../types/user-info';

export interface IOAuthService {
  getAuthUrl(): string;
  getUserInfo(code: string): Promise<UserInfo>;
}
