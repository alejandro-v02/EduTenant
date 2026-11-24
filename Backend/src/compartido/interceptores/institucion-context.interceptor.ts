import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Copia el institucionId del usuario autenticado a `request.institucionId`
 * para que quede disponible de forma explícita (logging, trazas) sin que
 * ningún handler o repositorio necesite volver a derivarlo del JWT.
 */
@Injectable()
export class InstitucionContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    if (request.user) {
      request.institucionId = request.user.institucionId ?? null;
    }

    return next.handle();
  }
}
