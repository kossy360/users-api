import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAppRequest } from '../../../types/request.type';

export const RequestUser: () => ParameterDecorator = createParamDecorator(
  (field: undefined, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest() as IAppRequest;

    if (!user) {
      throw new Error('Route not authenticated');
    }

    return user;
  },
);
