import clienteApi from './clienteApi';
import type { Usuario } from '../tipos/tipos';

export interface DatosNuevoUsuario {
  nombre: string;
  email: string;
  clave: string;
}

/** Todos los endpoints operan implícitamente sobre la institución del coordinador autenticado. */
export function crearProfesor(datos: DatosNuevoUsuario): Promise<Usuario> {
  return clienteApi.post<Usuario>('/usuarios/profesores', datos).then((r) => r.data);
}

export function listarProfesores(): Promise<Usuario[]> {
  return clienteApi.get<Usuario[]>('/usuarios/profesores').then((r) => r.data);
}

export function crearEstudiante(datos: DatosNuevoUsuario): Promise<Usuario> {
  return clienteApi.post<Usuario>('/usuarios/estudiantes', datos).then((r) => r.data);
}

export function listarEstudiantes(): Promise<Usuario[]> {
  return clienteApi.get<Usuario[]>('/usuarios/estudiantes').then((r) => r.data);
}

export function restablecerClave(usuarioId: string, claveNueva: string): Promise<void> {
  return clienteApi.patch(`/usuarios/${usuarioId}/clave`, { claveNueva }).then(() => undefined);
}
