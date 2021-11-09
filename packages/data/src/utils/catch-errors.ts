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

export async function catchErrors<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (e: any) {
    console.log(e);
    throw handleError(e);
  }
}

function handleError(error: any): Error {
  switch (error.constructor) {
    case CheckViolationError:
    case DataError:
      return new BadRequestError(error.message);

    case ObjectionNotFoundError:
      return new NotFoundError(error.message);

    case UniqueViolationError:
    case ForeignKeyViolationError:
    case ConstraintViolationError:
      return new ConflictError(error.message);

    case DBError:
    default:
      return new InternalServerError(error.message);
  }
}
