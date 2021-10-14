import { uuid } from '@etimo-achievements/common';
import { CreateUserService } from '@etimo-achievements/service';

export const create_user = async (req: any, res: any) => {
  const createUserService = new CreateUserService();

  console.log(req.body);

  await createUserService.create({
    id: uuid(),
    username: req.body['username'],
    password: req.body['password'],
    email: req.body['email'],
    slackHandle: req.body['slackHandle'],
  });

  return res.sendStatus(200);
};

export const get_user = async (req: any, res: any) => {
  res.send('NOT IMPLEMENTED: Site Home Page');
};
