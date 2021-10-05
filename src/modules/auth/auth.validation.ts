import { startOfToday } from 'date-fns';
import Joi from 'joi';

export const registerValidationSchema = Joi.object({
  firstName: Joi.string().max(200).required(),
  lastName: Joi.string().max(200).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  dob: Joi.date().less(startOfToday()).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().min(8).required(),
  nationality: Joi.string().max(4).uppercase().required(),
});

export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
