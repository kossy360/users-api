import { Injectable } from '@nestjs/common';
import { differenceInYears } from 'date-fns';
import { UserService } from '../../user/services/user.service';
import { ILoginResponse, ISignUpDTO } from '../auth.types';
import bcrypt from 'bcrypt';
import { IUser } from '../../user/user.type';
import { JwtService } from '@nestjs/jwt';
import { ErrorCodes } from '../../common/errors/error-codes';
import { UnauthorizedError } from '../../common/errors/http.error';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(payload: ISignUpDTO): Promise<ILoginResponse> {
    const user = await this.userService.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      dob: payload.dob,
      gender: payload.gender,
      phone: payload.phone,
      email: payload.email,
      password: bcrypt.hashSync(payload.password, 5),
      nat: payload.nationality,
    });

    return { user, accessToken: this.generateAccessToken(user) };
  }

  async login(email: string, password: string): Promise<ILoginResponse> {
    const user = await this.userService.verifyUser(email, password);

    if (!user) {
      throw new UnauthorizedError(
        ErrorCodes.INCORRECT_LOGIN_CREDENTIALS,
        'Email or password incorrect',
      );
    }

    return { user, accessToken: this.generateAccessToken(user) };
  }

  generateAccessToken(user: IUser): string {
    console.log(user)
    const accessToken = this.jwtService.sign(
      { email: user.email },
      { subject: user.id },
    );

    return accessToken;
  }
}
