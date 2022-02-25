import { uuid } from '@etimo-achievements/common';
import { Database } from '@etimo-achievements/data';
import { INewUser } from '@etimo-achievements/types';
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
      name: 'user-' + id,
      email: id + '@example.com',
      slackHandle: '@user' + id,
    };
    const createService = new CreateUserService();
    const getService = new GetUserService();
    const createdUser = await createService.create(user);
    const fetchedUser = await getService.get(createdUser.id);
    expect(fetchedUser.name).toBe(user.name);
  });
});
