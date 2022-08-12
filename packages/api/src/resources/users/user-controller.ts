import {
  CreateUserService,
  DeleteUserService,
  GetUserService,
  SyncSlackUsersService,
  UpdateUserService,
} from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import {
  badRequestResponse,
  createdResponse,
  getContext,
  noContentResponse,
  okResponse,
  paginatedResponse,
  protectedEndpoint,
} from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { validateOrderBy } from '../../utils/validation-helper';
import { UserMapper } from './user-mapper';

export class UserController {
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
     *       - *orderByParam
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *usersContent
     *     tags:
     *       - Users
     */
    router.get('/users', protectedEndpoint(this.getUsers, ['r:users']));

    /**
     * @openapi
     * /users/list:
     *   post:
     *     summary: Get many users by list of ids
     *     operationId: listAchievements
     *     security:
     *       - jwtCookie: []
     *     requestBody:
     *       required: true
     *       content: *idListObject
     *     responses:
     *       200:
     *         description: The request was successful.
     *         content: *usersContent
     *       400: *badRequestResponse
     *       401: *unauthorizedResponse
     *       404: *notFoundResponse
     *     tags:
     *       - Achievements
     */
    router.post('/users/list', protectedEndpoint(this.listUsers, ['r:users']));

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
    router.get('/users/:userId', protectedEndpoint(this.getUser, ['r:users']));

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
    router.get('/profile', protectedEndpoint(this.getProfile, ['r:profile']));

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
    router.post('/users', protectedEndpoint(this.createUser, ['c:users']));

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
    router.put('/users/:userId', protectedEndpoint(this.updateUser, ['u:users']));

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
    router.put('/profile', protectedEndpoint(this.updateProfile, ['u:profile']));

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
    router.delete('/users/:userId', protectedEndpoint(this.deleteUser, ['d:users']));

    return router;
  }

  private getUsers = async (req: Request, res: Response) => {
    const paginationOpts = getPaginationOptions(req);
    validateOrderBy(paginationOpts.orderBy, UserMapper.isProperty);

    const service = new GetUserService(getContext());
    const users = await service.getMany(paginationOpts);

    return paginatedResponse(res, '/users', users, UserMapper.toUserDto);
  };

  private listUsers = async (req: Request, res: Response) => {
    const payload = req.body as string[];

    if (payload.length > 100) {
      return badRequestResponse(res, 'Too many ids');
    }

    const service = new GetUserService(getContext());
    const users = await service.getManyByIds(payload);
    const dtos = users.map(UserMapper.toUserDto);

    return okResponse(res, dtos);
  };

  private getUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const service = new GetUserService(getContext());
    const user = await service.get(userId);
    const dto = UserMapper.toUserDto(user);

    return okResponse(res, dto);
  };

  private getProfile = async (_req: Request, res: Response) => {
    const { userId } = getContext();

    const service = new GetUserService(getContext());
    const user = await service.get(userId);
    const dto = UserMapper.toUserDto(user);

    return okResponse(res, dto);
  };

  private createUser = async (req: Request, res: Response) => {
    const payload = req.body;

    const service = new CreateUserService(getContext());
    const input = UserMapper.toUser(payload);
    const user = await service.create(input);
    const slackService = new SyncSlackUsersService(getContext());
    try {
      await slackService.syncUser(user.email);
    } catch (err) {} // Do not crash if fail, we can sync later

    return createdResponse(res, '/users', user);
  };

  private updateUser = async (req: Request, res: Response) => {
    const payload = req.body;
    const userId = req.params.userId;

    const service = new UpdateUserService(getContext());
    const input = UserMapper.toUser({ ...payload, id: userId });
    await service.update(input);
    const slackService = new SyncSlackUsersService(getContext());
    try {
      await slackService.syncUser(payload.email);
    } catch (err) {} // Do not crash if fail, we can sync later

    return noContentResponse(res);
  };

  private updateProfile = async (req: Request, res: Response) => {
    const { userId } = getContext();
    const payload = req.body;

    const service = new UpdateUserService(getContext());
    const input = UserMapper.toUser({ ...payload, id: userId });
    await service.update(input);
    const slackService = new SyncSlackUsersService(getContext());
    try {
      await slackService.syncUser(payload.email);
    } catch (err) {} // Do not crash if fail, we can sync later

    return noContentResponse(res);
  };

  private deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const service = new DeleteUserService(getContext());
    await service.delete(userId);

    return okResponse(res);
  };
}
