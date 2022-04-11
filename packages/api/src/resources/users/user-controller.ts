import { getContext } from '@etimo-achievements/express-middleware';
import { CreateUserService, DeleteUserService, GetUserService, UpdateUserService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { createdResponse, noContentResponse, okResponse, protectedEndpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { UserMapper } from './user-mapper';

export type UserControllerOptions = {
  createUserService?: CreateUserService;
  getUserService?: GetUserService;
  updateUserService?: UpdateUserService;
  deleteUserService?: DeleteUserService;
};

export class UserController {
  private createUserService: CreateUserService;
  private getUserService: GetUserService;
  private updateUserService: UpdateUserService;
  private deleteUserService: DeleteUserService;

  constructor(options?: UserControllerOptions) {
    this.createUserService = options?.createUserService ?? new CreateUserService();
    this.getUserService = options?.getUserService ?? new GetUserService();
    this.updateUserService = options?.updateUserService ?? new UpdateUserService();
    this.deleteUserService = options?.deleteUserService ?? new DeleteUserService();
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
     * /profile:
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
    router.get('/profile', protectedEndpoint(this.getProfile, ['rw:profile', 'r:profile']));

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
     * /profile:
     *   put:
     *     summary: Update your profile
     *     operationId: updateProfile
     *     security:
     *       - jwtCookie: []
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
    router.put('/profile', protectedEndpoint(this.updateProfile, ['rw:profile', 'w:profile']));

    /**
     * @openapi
     * /users/{userId}:
     *   delete:
     *     summary: Delete an user
     *     operationId: deleteUser
     *     security:
     *       - jwtCookie: []
     *     parameters:
     *       - *userIdParam
     *     responses:
     *       200: *okResponse
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *     tags:
     *       - Users
     */
    router.delete('/users/:userId', protectedEndpoint(this.deleteUser, ['rw:users', 'w:users']));

    return router;
  }

  private getUsers = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const users = await this.getUserService.getMany(skip, take);
    const output = { ...users, data: users.data.map(UserMapper.toUserDto) };

    return okResponse(res, output);
  };

  private getUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const user = await this.getUserService.get(userId);
    const dto = UserMapper.toUserDto(user);

    return okResponse(res, dto);
  };

  private getProfile = async (_req: Request, res: Response) => {
    const { userId } = getContext();

    const user = await this.getUserService.get(userId);
    const dto = UserMapper.toUserDto(user);

    return okResponse(res, dto);
  };

  private createUser = async (req: Request, res: Response) => {
    const payload = req.body;

    const input = UserMapper.toUser(payload);
    const user = await this.createUserService.create(input);

    return createdResponse('/users', user, res);
  };

  private updateUser = async (req: Request, res: Response) => {
    const payload = req.body;
    const userId = req.params.userId;

    const input = UserMapper.toUser({ ...payload, id: userId });
    await this.updateUserService.update(input);

    return noContentResponse(res);
  };

  private updateProfile = async (req: Request, res: Response) => {
    const { userId } = getContext();
    const payload = req.body;

    const input = UserMapper.toUser({ ...payload, id: userId });
    await this.updateUserService.update(input);

    return noContentResponse(res);
  };

  private deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    await this.deleteUserService.delete(userId);

    return okResponse(res);
  };
}
