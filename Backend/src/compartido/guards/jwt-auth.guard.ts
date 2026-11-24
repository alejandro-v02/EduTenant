import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Valida el JWT (delegado a JwtStrategy) y puebla request.user. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
