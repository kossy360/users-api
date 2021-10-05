import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import Joi from 'joi';
import lodash from 'lodash';
import { ErrorCodes } from '../errors/error-codes';
import { BadRequestError } from '../errors/http.error';

@Catch(Joi.ValidationError)
export class JoiExceptionFilter implements ExceptionFilter {
  catch(error: Joi.ValidationError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse() as Response;
    const details = error.details.reduce((acc, err) => {
      return lodash.set(acc, err.path, err.message.replace(/"(\w+)"/g, '$1'));
    }, {});
    const err = new BadRequestError(
      ErrorCodes.VALIDATION_FAILED,
      'Validation failed',
      {
        details,
      },
    );

    res.status(err.getStatus()).json(err.getResponse());
  }
}
