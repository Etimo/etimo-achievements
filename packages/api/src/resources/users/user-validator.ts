import { ValidationError } from '../../errors/validation-error';
import { NewUserDto } from './user-dto';

export function validateNewUser(user: NewUserDto): boolean {
  if (!user.username) {
    throw new ValidationError('username is required');
  }

  if (user.username.length < 3) {
    throw new ValidationError('username must be at least 3 characters long');
  }

  if (!user.password) {
    throw new ValidationError('password is required');
  }

  if (user.password.length < 10) {
    throw new ValidationError('password must be at least 10 characters long');
  }

  if (!user.email) {
    throw new ValidationError('email is required');
  }

  if (user.email.indexOf('@') === -1) {
    throw new ValidationError('email is invalid');
  }

  if (!user.slackHandle) {
    throw new ValidationError('slackHandle is required');
  }

  if (user.slackHandle.indexOf('@') !== 0) {
    throw new ValidationError('slackHandle must start with an @');
  }

  return true;
}
