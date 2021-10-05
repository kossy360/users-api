import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DatabaseExceptionFilter } from './filters/database.filter';
import { HttpExceptionFilter } from './filters/http.filter';
import { JoiExceptionFilter } from './filters/joi-exception.filter';

@Global()
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: JoiExceptionFilter,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: DatabaseExceptionFilter,
    // },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class CommonModule {}
