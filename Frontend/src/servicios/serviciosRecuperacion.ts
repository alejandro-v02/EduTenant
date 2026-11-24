import clienteApi from './clienteApi';

export function solicitarRecuperacionClave(email: string): Promise<void> {
  return clienteApi.post('/autenticacion/olvide-clave', { email }).then(() => undefined);
}

export function restablecerClaveConToken(token: string, claveNueva: string): Promise<void> {
  return clienteApi.post('/autenticacion/restablecer-clave', { token, claveNueva }).then(() => undefined);
}
