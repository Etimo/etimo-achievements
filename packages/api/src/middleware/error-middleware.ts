import {
  CheckViolationError,
  DataError,
  DBError,
  ForeignKeyViolationError,
  NotFoundError,
  NotNullViolationError,
  UniqueViolationError,
  ValidationError,
} from '@etimo-achievements/service';
import { NextFunction, Request, Response } from 'express';
import { ValidationError as ApiValidationError } from '../errors/validation-error';

export const errorMiddleware = () => {
  return (_req: Request, res: Response, next: NextFunction) => {
    try {
      next();
    } catch (error: any) {
      return handleError(error, res);
    }
  };
};

function handleError(error: any, res: Response) {
  if (error instanceof ApiValidationError) {
    return res.status(400).send(error.message);
  }

  if (error instanceof ValidationError) {
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

  if (error instanceof NotFoundError) {
    return res.status(404).send({
      message: error.message,
      type: 'NotFound',
      data: {},
    });
  }

  if (error instanceof UniqueViolationError) {
    return res.status(409).send({
      message: error.message,
      type: 'UniqueViolation',
      data: {
        columns: error.columns,
        table: error.table,
        constraint: error.constraint,
      },
    });
  }

  if (error instanceof NotNullViolationError) {
    return res.status(400).send({
      message: error.message,
      type: 'NotNullViolation',
      data: {
        column: error.column,
        table: error.table,
      },
    });
  }

  if (error instanceof ForeignKeyViolationError) {
    return res.status(409).send({
      message: error.message,
      type: 'ForeignKeyViolation',
      data: {
        table: error.table,
        constraint: error.constraint,
      },
    });
  }

  if (error instanceof CheckViolationError) {
    return res.status(400).send({
      message: error.message,
      type: 'CheckViolation',
      data: {
        table: error.table,
        constraint: error.constraint,
      },
    });
  }

  if (error instanceof DataError) {
    return res.status(400).send({
      message: error.message,
      type: 'InvalidData',
      data: {},
    });
  }

  if (error instanceof DBError) {
    return res.status(500).send({
      message: error.message,
      type: 'UnknownDatabaseError',
      data: {},
    });
  }

  return res.status(500).send({
    message: error.message,
    type: 'UnknownError',
    data: {},
  });
}
