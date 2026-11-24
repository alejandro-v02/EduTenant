import clienteApi from './clienteApi';
import type { RespuestaLogin } from '../tipos/tipos';

export function iniciarSesion(email: string, clave: string): Promise<RespuestaLogin> {
  return clienteApi.post<RespuestaLogin>('/autenticacion/login', { email, clave }).then((r) => r.data);
}
