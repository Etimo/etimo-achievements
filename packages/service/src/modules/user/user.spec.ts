import { uuid } from '@etimo-achievements/common';
import { Database, INewUser } from '@etimo-achievements/data';
import { CreateUserService, GetUserService } from '.';

beforeEach(() => {
  Database.connect();
});

afterEach(() => {
  Database.disconnect();
});

describe('CreateUserService', () => {
  test('should create a user', async () => {
    const id = uuid().substring(0, 8);
    const user: INewUser = {
      username: 'user-' + id,
      password: 'Test12345!',
      email: id + '@example.com',
      slackHandle: '@user' + id,
    };
    const createService = new CreateUserService();
    const getService = new GetUserService();
    const createdUser = await createService.create(user);
    const fetchedUser = await getService.get(createdUser.id);
    expect(fetchedUser.username).toBe(user.username);
  });
});
