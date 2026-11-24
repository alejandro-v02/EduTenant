import { RolUsuario } from './rol.enum';

/** Forma del objeto adjuntado a `request.user` tras validar el JWT. */
export interface UsuarioAutenticado {
  id: string;
  institucionId: string | null;
  rol: RolUsuario;
}
