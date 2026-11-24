import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { RolUsuario } from '../tipos/rol.enum';

/**
 * Exige que el usuario autenticado tenga institucionId cuando su rol lo
 * requiere (todos menos superadministrador). No lee ni acepta institucionId
 * del cliente: sólo valida lo que ya trae el JWT.
 */
@Injectable()
export class InstitucionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (user.rol !== RolUsuario.SUPERADMINISTRADOR && !user.institucionId) {
      throw new ForbiddenException('El usuario no tiene una institución asociada');
    }

    return true;
  }
}
