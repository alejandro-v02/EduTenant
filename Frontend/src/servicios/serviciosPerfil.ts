import clienteApi from './clienteApi';
import type { DatosActualizarPerfil, Usuario } from '../tipos/tipos';

/** El backend identifica al usuario por el JWT: nunca se envía un id ni institucionId aquí. */
export function obtenerMiPerfil(): Promise<Usuario> {
  return clienteApi.get<Usuario>('/perfil').then((r) => r.data);
}

export function actualizarMiPerfil(datos: DatosActualizarPerfil): Promise<Usuario> {
  return clienteApi.patch<Usuario>('/perfil', datos).then((r) => r.data);
}

export function cambiarMiClave(claveActual: string, claveNueva: string): Promise<void> {
  return clienteApi.patch('/perfil/clave', { claveActual, claveNueva }).then(() => undefined);
}
