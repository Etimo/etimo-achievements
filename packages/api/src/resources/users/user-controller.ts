import { CreateUserService, GetUsersService, GetUserService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { UserMapper } from '.';
import { endpoint } from '../../utils';
import { getPaginationOptions } from '../../utils/pagination-helper';
import { validate } from '../../utils/validation-helper';
import { newUserValidator, guidValidator } from './user-validator';

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
     *     description: Get users.
     *     responses:
     *       200:
     *         description: A list of users.
     */
    router.get('/users', endpoint(this.getUsers));

    /**
     * @openapi
     * /users/{userId}:
     *   get:
     *     description: Get user.
     *     parameters:
     *       - name: userId
     *         in: path
     *         required: true
     *         type: string
     *         format: uuid
     *     responses:
     *       200:
     *         description: A user.
     *       400:
     *         description: Bad request, missing or invalid parameter.
     *       404:
     *         description: Not found, the user was not found.
     */
    router.get('/users/:userId', endpoint(this.getUser));

    /**
     * @openapi
     * /users:
     *   post:
     *     description: Creates a user.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: username
     *         in: formData
     *         required: true
     *         type: string
     *       - name: password
     *         in: formData
     *         required: true
     *         type: string
     *       - name: email
     *         in: formData
     *         required: true
     *         type: string
     *         format: email
     *       - name: slackHandle
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: User was created.
     *       400:
     *         description: Bad request, missing or invalid parameter.
     */
    router.post('/users', endpoint(this.createUser));
    return router;
  }

  private getUsers = async (req: Request, res: Response) => {
    const [skip, take] = getPaginationOptions(req);
    const users = await this.getUsersService.getAll(skip, take);
    const output = { ...users, data: users.data.map(UserMapper.toUserDto) };

    return res.status(200).send(output);
  };

  private getUser = async (req: Request, res: Response) => {
    validate(guidValidator, req.params, res);

    const userId = req.params.userId;
    const user = await this.getUserService.get(userId);

    if (user === undefined) return res.status(404).send();

    const userDto = UserMapper.toUserDto(user);
    return res.status(200).send(userDto);
  };

  private createUser = async (req: Request, res: Response) => {
    const payload = req.body;

    validate(newUserValidator, payload, res);

    const input = UserMapper.toNewUser(payload);
    const user = await this.createUserService.create(input);
    const output = UserMapper.toUserDto(user);

    return res.status(201).send(output);
  };
}
