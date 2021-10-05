import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/auth.guards';

export function Protected() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
