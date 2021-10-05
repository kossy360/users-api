import { Body, Controller, Post } from '@nestjs/common';
import Joi from 'joi';
import { ILoginDTO, ISignUpDTO } from './auth.types';
import {
  loginValidationSchema,
  registerValidationSchema,
} from './auth.validation';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: ISignUpDTO) {
    const result = await this.authService.register(
      await registerValidationSchema.validateAsync(payload, {
        abortEarly: false,
        stripUnknown: true,
      }),
    );

    return result;
  }

  @Post('login')
  async login(@Body() payload: ILoginDTO) {
    const { email, password } = await loginValidationSchema.validateAsync(
      payload,
      {
        abortEarly: false,
        stripUnknown: true,
      },
    );
    const result = await this.authService.login(email, password);

    return result;
  }
}
