import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { NativeError } from 'mongoose';
import { ErrorCodes } from '../errors/error-codes';
import { ServerError } from '../errors/http.error';

@Catch(Error)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(error: NativeError, host: ArgumentsHost) {
    return new ServerError(
      ErrorCodes.SERVER_ERROR,
      'Something happened, try again later',
    );
  }
}
