import { getContext } from '@etimo-achievements/express-middleware';
import { CreateUserService, GetUserService, UpdateUserService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { createdResponse, protectedEndpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { UserMapper } from './user-mapper';

export type UserControllerOptions = {
  createUserService?: CreateUserService;
  getUserService?: GetUserService;
  updateUserService?: UpdateUserService;
};

export class UserController {
  private createUserService: CreateUserService;
  private getUserService: GetUserService;
  private updateUserService: UpdateUserService;

  constructor(options?: UserControllerOptions) {
    this.createUserService = options?.createUserService ?? new CreateUserService();
    this.getUserService = options?.getUserService ?? new GetUserService();
    this.updateUserService = options?.updateUserService ?? new UpdateUserService();
  }

  public get routes(): Router {
    const router = Router();

    /**
     * @openapi
     * /users:
     *   get:
     *     summary: Get a list of users
     *     operationId: getUsers
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *skipParam
     *       - *takeParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *usersContent
     *     tags:
     *       - Users
     */
    router.get('/users', protectedEndpoint(this.getUsers, ['rw:users', 'r:users']));

    /**
     * @openapi
     * /users/{userId}:
     *   get:
     *     summary: Get a single user
     *     operationId: getUser
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *userIdParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *userContent
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *       404: *notFoundResponse
     *     tags:
     *       - Users
     */
    router.get('/users/:userId', protectedEndpoint(this.getUser, ['rw:users', 'r:users']));

    /**
     * @openapi
     * /users/profile:
     *   get:
     *     summary: Get your profile
     *     operationId: getProfile
     *     security:
     *       - jwtCookie: []
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *userContent
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *       404: *notFoundResponse
     *     tags:
     *       - Users
     */
    router.get('/users/profile', protectedEndpoint(this.getProfile, ['rw:profile', 'r:profile']));

    /**
     * @openapi
     * /users:
     *   post:
     *     summary: Create a user
     *     operationId: createUser
     *     security:
     *       - jwtCookie: []
     *     requestBody:
     *       required: true
     *       content: *userContent
     *     responses:
     *       201:
     *         description: The user was created.
     *         content: *idObject
     *         links: *userLink
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Users
     */
    router.post('/users', protectedEndpoint(this.createUser, ['rw:users', 'w:users']));

    /**
     * @openapi
     * /users/{userId}:
     *   put:
     *     summary: Update a user
     *     operationId: updateUser
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *userIdParam
     *     requestBody:
     *       required: true
     *       content: *userContent
     *     responses:
     *       204: *noContentResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Users
     */
    router.put('/users/:userId', protectedEndpoint(this.updateUser, ['rw:users', 'w:users']));

    /**
     * @openapi
     * /users/profile:
     *   put:
     *     summary: Update your profile
     *     operationId: updateProfile
     *     security:
     *       - jwtCookie: []
     *     requestBody:
     *       required: true
     *       content: *profileContent
     *     responses:
     *       204: *noContentResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Users
     */
    router.put('/users/profile', protectedEndpoint(this.updateProfile, ['rw:profile', 'w:profile']));

    return router;
  }

  private getUsers = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const users = await this.getUserService.getMany(skip, take);
    const output = { ...users, data: users.data.map(UserMapper.toUserDto) };

    return res.status(200).send(output);
  };

  private getUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const user = await this.getUserService.get(userId);
    const userDto = UserMapper.toUserDto(user);

    return res.status(200).send(userDto);
  };

  private getProfile = async (req: Request, res: Response) => {
    const { userId } = getContext();

    const user = await this.getUserService.get(userId);
    const userDto = UserMapper.toUserDto(user);

    return res.status(200).send(userDto);
  };

  private createUser = async (req: Request, res: Response) => {
    const payload = req.body;

    const input = UserMapper.toUser(payload);
    const user = await this.createUserService.create(input);

    return createdResponse('/users', user, res);
  };

  private updateUser = async (req: Request, res: Response) => {
    const payload = req.body;

    const input = UserMapper.toUser(payload);
    await this.updateUserService.update(input);

    return res.status(204).send();
  };

  private updateProfile = async (req: Request, res: Response) => {
    const ctx = getContext();
    console.log(ctx);
    const payload = req.body;

    const input = UserMapper.toUser({ ...payload, id: ctx.jwt?.sub });
    await this.updateUserService.update(input);

    return res.status(204).send();
  };
}
