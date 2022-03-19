import { CreateUserService, GetUserService, GetUsersService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { createdResponse, protectedEndpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { UserMapper } from './user-mapper';

export type UserControllerOptions = {
  createUserService?: CreateUserService;
  getUsersService?: GetUsersService;
  getUserService?: GetUserService;
};

export class UserController {
  private createUserService: CreateUserService;
  private getUsersService: GetUsersService;
  private getUserService: GetUserService;

  constructor(options?: UserControllerOptions) {
    this.createUserService = options?.createUserService ?? new CreateUserService();
    this.getUsersService = options?.getUsersService ?? new GetUsersService();
    this.getUserService = options?.getUserService ?? new GetUserService();
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
     *       - bearerAuth: []
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
    router.get('/users', protectedEndpoint(this.getUsers));

    /**
     * @openapi
     * /users/{userId}:
     *   get:
     *     summary: Get a single user
     *     operationId: getUser
     *     security:
     *       - bearerAuth: []
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
    router.get('/users/:userId', protectedEndpoint(this.getUser));

    /**
     * @openapi
     * /users:
     *   post:
     *     summary: Create a user
     *     operationId: createUser
     *     security:
     *       - bearerAuth: []
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
    router.post('/users', protectedEndpoint(this.createUser));

    return router;
  }

  private getUsers = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const users = await this.getUsersService.getAll(skip, take);
    const output = { ...users, data: users.data.map(UserMapper.toUserDto) };

    return res.status(200).send(output);
  };

  private getUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;
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
}
