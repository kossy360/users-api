import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ErrorCodes } from '../errors/error-codes';
import {
  BaseHttpError,
  NotFoundError,
  ServerError,
} from '../errors/http.error';
import { Response } from 'express';

@Catch(BaseHttpError, HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: BaseHttpError | HttpException, host: ArgumentsHost) {
    const res: Response = host.switchToHttp().getResponse();
    const err =
      error instanceof BaseHttpError
        ? error
        : error instanceof HttpException
        ? new NotFoundError(ErrorCodes.RESOURCE_NOT_FOUND, error.message)
        : new ServerError(
            ErrorCodes.SERVER_ERROR,
            'Something went wrong, we are working on it',
          );

    res.status(err.getStatus()).json(err.getResponse());
  }
}
