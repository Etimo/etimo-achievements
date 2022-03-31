import { IUser } from '@etimo-achievements/types';

export interface AuthError {
  message: string;
}

export interface AuthState {
  isAuth: boolean;
  currentUser?: IUser;
  isLoading: boolean;
  error: AuthError;
}
