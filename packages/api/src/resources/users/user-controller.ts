import { CreateUserService } from '@etimo-achievements/service';
import { Request, Response, Router } from 'express';
import { UserMapper } from '.';
import { validateNewUser } from './user-validator';

export type UserControllerOptions = {
  createUserService?: CreateUserService;
};

export class UserController {
  private createUserService: CreateUserService;

  constructor(options?: UserControllerOptions) {
    this.createUserService = options?.createUserService ?? new CreateUserService();
  }

  public routes(): Router {
    const router = Router();
    router.get('/', this.getUser);
    router.post('/', this.createUser);
    return router;
  }

  private createUser = async (req: Request, res: Response) => {
    const payload = req.body;

    validateNewUser(payload);

    const input = UserMapper.toNewUser(payload);
    const user = await this.createUserService.create(input);
    const output = UserMapper.toUserDto(user);

    return res.status(201).send(output);
  };

  private getUser = (_req: Request, res: Response) => {
    res.send('NOT IMPLEMENTED: Site Home Page');
  };
}
