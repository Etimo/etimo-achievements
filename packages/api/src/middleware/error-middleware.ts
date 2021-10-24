import {
  CheckViolationError,
  ConstraintViolationError,
  DataError,
  DBError,
  ForeignKeyViolationError,
  NotFoundError,
  NotNullViolationError,
  UniqueViolationError,
  ValidationError,
} from '@etimo-achievements/service';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { ForbiddenError } from '../errors/forbidden-error';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { ValidationError as ApiValidationError } from '../errors/validation-error';

export const errorMiddleware = () => {
  return (error: Error, _req: Request, res: Response, next: NextFunction) => {
    return handleError(error, res);
  };
};

export function handleError(error: any, res: Response) {
  switch (error.constructor) {
    case ValidationError:
      return handleValidationError(error, res);

    case ApiValidationError:
    case BadRequestError:
      return res.status(400).send(error.message);

    case UnauthorizedError:
      return res.status(401).send(error.message);

    case ForbiddenError:
      return res.status(403).send(error.message);

    default:
      return handleRemainingErrors(error, res);
  }
}

function handleValidationError(error: any, res: Response) {
  switch (error.type) {
    case 'ModelValidation':
      return res.status(400).send({
        message: error.message,
        type: error.type,
        data: error.data,
      });

    case 'RelationExpression':
      return res.status(400).send({
        message: error.message,
        type: 'RelationExpression',
        data: {},
      });

    case 'UnallowedRelation':
      return res.status(400).send({
        message: error.message,
        type: error.type,
        data: {},
      });

    case 'InvalidGraph':
      return res.status(400).send({
        message: error.message,
        type: error.type,
        data: {},
      });

    default:
      return res.status(400).send({
        message: error.message,
        type: 'UnknownValidationError',
        data: {},
      });
  }
}

function handleRemainingErrors(error: any, res: Response) {
  switch (error.constructor) {
    case NotFoundError:
      return res.status(404).send({
        message: error.message,
        type: 'NotFound',
        data: {},
      });

    case UniqueViolationError:
      return res.status(409).send({
        message: error.message,
        type: 'UniqueViolation',
        data: {
          columns: error.columns,
          table: error.table,
          constraint: error.constraint,
        },
      });

    case NotNullViolationError:
      return res.status(400).send({
        message: error.message,
        type: 'NotNullViolation',
        data: {
          column: error.column,
          table: error.table,
        },
      });

    case ForeignKeyViolationError:
      return res.status(409).send({
        message: error.message,
        type: 'ForeignKeyViolation',
        data: {
          table: error.table,
          constraint: error.constraint,
        },
      });

    case ConstraintViolationError:
      return res.status(409).send({
        message: error.message,
        type: 'ConstraintViolation',
        data: {
          table: error.table,
          constraint: error.constraint,
        },
      });

    case CheckViolationError:
      return res.status(400).send({
        message: error.message,
        type: 'CheckViolation',
        data: {
          table: error.table,
          constraint: error.constraint,
        },
      });

    case DataError:
      return res.status(400).send({
        message: error.message,
        type: 'InvalidData',
        data: {},
      });

    case DBError:
      return res.status(500).send({
        message: error.message,
        type: 'UnknownDatabaseError',
        data: {},
      });

    default:
      console.error(error.stack);
      return res.status(500).send({
        message: error.message,
        type: 'UnknownError',
        data: {},
      });
  }
}
