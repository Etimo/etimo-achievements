import { RoleItem, ROLES } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GetRoleService {
  constructor(private context: IContext) {}

  public async getAll(): Promise<RoleItem[]> {
    return Object.values(ROLES);
  }
}
