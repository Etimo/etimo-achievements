import { uuid } from '@etimo-achievements/common';
import { Database, INewUser } from '@etimo-achievements/data';
import { CreateUserService } from '../../../dist';

Database.connect();

describe('CreateUserService', () => {
  test('should create a user', async () => {
    const id = uuid().substring(0, 8);
    const user: INewUser = {
      username: 'user-' + id,
      password: 'Test12345!',
      email: id + '@example.com',
      slackHandle: '@user' + id,
    };
    const service = new CreateUserService();
    const result = await service.create(user);
    expect(result).toBe('test');
  });
});
