import { createContext } from 'react';
import type { Rol, UsuarioSesion } from '../tipos/tipos';

export interface SesionContextValor {
  usuario: UsuarioSesion | null;
  rol: Rol | null;
  institucionId: string | null;
  token: string | null;
  cargando: boolean;
  login: (email: string, clave: string) => Promise<UsuarioSesion>;
  logout: () => void;
  actualizarUsuarioSesion: (cambios: Partial<UsuarioSesion>) => void;
}

/**
 * El objeto de contexto vive en su propio archivo (sin componentes) para que
 * SesionContext.tsx sólo exporte el Provider y useSesion.ts sólo el hook: así
 * Vite puede aplicar Fast Refresh a cada uno sin recargar la página entera
 * (y perder la sesión en memoria) cada vez que se edita alguno de los dos.
 */
export const SesionContext = createContext<SesionContextValor | undefined>(undefined);
