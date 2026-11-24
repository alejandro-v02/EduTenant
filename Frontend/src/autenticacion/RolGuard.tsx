import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { rutaBasePorRol } from './rutasPorRol';
import { useSesion } from './useSesion';
import type { Rol } from '../tipos/tipos';

interface RolGuardProps {
  rolesPermitidos: Rol[];
}

/**
 * Bloquea rutas de otros roles: redirige a /login si no hay sesión, o al panel propio si el rol
 * no coincide. El perfil incompleto no redirige a ninguna parte: LayoutConSidebar abre el modal
 * de perfil (bloqueado) encima del módulo que sea, sin sacar al usuario de la ruta actual.
 */
export function RolGuard({ rolesPermitidos }: RolGuardProps) {
  const { usuario } = useSesion();
  const ubicacion = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }

  if (!rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to={rutaBasePorRol(usuario.rol)} replace />;
  }

  return <Outlet />;
}
