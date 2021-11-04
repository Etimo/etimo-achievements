import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from '@etimo-achievements/common';
import {
  CheckViolationError,
  ConstraintViolationError,
  DataError,
  DBError,
  ForeignKeyViolationError,
  NotFoundError as ObjectionNotFoundError,
  UniqueViolationError,
} from 'objection';

function handleRemainingErrors(error: any, res: Response) {
  switch (error.constructor) {
    case CheckViolationError:
    case DataError:
      throw new BadRequestError(error.message);

    case ObjectionNotFoundError:
      throw new NotFoundError(error.message);

    case UniqueViolationError:
    case ForeignKeyViolationError:
    case ConstraintViolationError:
      throw new ConflictError(error.message);

    case DBError:
    default:
      throw new InternalServerError(error.message);
  }
}
