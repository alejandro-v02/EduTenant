import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../tipos/rol.enum';

export const ROLES_KEY = 'roles';

/** Declara qué roles pueden acceder a un endpoint; lo lee RolesGuard. */
export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);
