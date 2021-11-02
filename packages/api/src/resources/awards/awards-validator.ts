import Joi from 'joi';

export const newAwardValidator = Joi.object({
  achievementId: Joi.string().uuid(),
  userId: Joi.string().uuid(),
});
