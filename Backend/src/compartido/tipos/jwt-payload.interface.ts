import { RolUsuario } from './rol.enum';

/** Forma exacta del payload firmado en el JWT: { sub, institucionId, rol }. */
export interface JwtPayload {
  sub: string;
  institucionId: string | null;
  rol: RolUsuario;
}
