import { Response } from 'express';
import Joi from 'joi';
import { ValidationError } from '../errors/validation-error';

export function validate(validator: Joi.ObjectSchema<any>, value: any, res: Response) {
  const validationResult = validator.validate(value);
  if (validationResult.error) {
    throw new ValidationError(validationResult.error.message);
  }
}
