import Joi from 'joi';

export const getUsersQueryValidationSchema = Joi.object({
  page: Joi.number().integer().positive().min(1).default(1),
  limit: Joi.number().integer().positive().min(1).max(50).default(10),
});
