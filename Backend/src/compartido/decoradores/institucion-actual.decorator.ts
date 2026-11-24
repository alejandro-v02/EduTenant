import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

/**
 * Única fuente permitida del institucionId: se extrae del JWT del usuario
 * autenticado. Ningún endpoint (fuera de superadministrador) debe leer este
 * valor del body o del query del cliente.
 */
export const InstitucionActual = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const institucionId = request.user?.institucionId;

    if (!institucionId) {
      throw new UnauthorizedException('El usuario autenticado no tiene una institución asociada');
    }

    return institucionId;
  },
);
