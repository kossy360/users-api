import { Request } from 'express';
import { IUser } from '../modules/user/user.type';

export interface IAppRequest extends Request {
  user: IUser;
}
