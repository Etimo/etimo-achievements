import Joi from 'joi';

export const newAchievementValidator = Joi.object({
  achievement: Joi.string().alphanum().min(3).max(255).required(),
  description: Joi.string().min(3).max(255).optional(),
});
