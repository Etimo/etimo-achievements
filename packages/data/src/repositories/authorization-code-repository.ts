import { IAuthorizationCode } from '../models';
import {
  AuthorizationCodeModel,
  INewAuthorizationCode,
  IPartialAuthorizationCode,
} from '../models/authorization-code-model';

export class AuthorizationCodeRepository {
  findByCode(id: string): Promise<IAuthorizationCode> {
    return AuthorizationCodeModel.query().findById(id);
  }

  create(authorizationCode: INewAuthorizationCode): Promise<IAuthorizationCode> {
    return AuthorizationCodeModel.query().insert(authorizationCode);
  }

  update(authorizationCode: IPartialAuthorizationCode): Promise<IAuthorizationCode> {
    return AuthorizationCodeModel.query().patchAndFetchById(authorizationCode.id, authorizationCode);
  }

  delete(id: string): Promise<number> {
    return AuthorizationCodeModel.query().deleteById(id);
  }
}
