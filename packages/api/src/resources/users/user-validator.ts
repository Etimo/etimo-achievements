import Joi from 'joi';

export const newUserValidator = Joi.object({
  username: Joi.string().alphanum().min(3).max(32).required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,64}$/)
    .required(),
  email: Joi.string().email().required(),
  slackHandle: Joi.string()
    .pattern(/^@[a-zA-Z0-9]{3,32}$/)
    .required(),
});
