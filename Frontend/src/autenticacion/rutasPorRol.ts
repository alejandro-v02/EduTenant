import type { Rol } from '../tipos/tipos';

const RUTA_BASE_POR_ROL: Record<Rol, string> = {
  superadministrador: '/superadministrador',
  coordinador: '/coordinador',
  profesor: '/profesor',
  estudiante: '/estudiante',
};

export function rutaBasePorRol(rol: Rol): string {
  return RUTA_BASE_POR_ROL[rol];
}
