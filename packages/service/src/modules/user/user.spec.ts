import { Database } from '@etimo-achievements/data';

beforeEach(() => {
  Database.connect();
});

afterEach(() => {
  Database.disconnect();
});

// TODO: Make this work with context -- create test context
/*
describe('CreateUserService', () => {
  test('should create a user', async () => {
    const id = uuid().substring(0, 8);
    const user: INewUser = {
      name: 'user-' + id,
      email: id + '@example.com',
      slackHandle: '@user' + id,
    };
    const createService = new CreateUserService(options);
    const getService = new GetUserService(options);
    const createdUser = await createService.create(user);
    const fetchedUser = await getService.get(createdUser.id);
    expect(fetchedUser.name).toBe(user.name);
  });
});
*/
