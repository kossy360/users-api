import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAppRequest } from '../../../types/request.type';
import { UserService } from '../../user/services/user.service';
import { IUser } from '../../user/user.type';
import { IJwtPayload } from '../auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: IAppRequest, payload: IJwtPayload): Promise<IUser> {
    const user = await this.userService.findOne(payload.sub);

    request.user = user;

    return user;
  }
}
