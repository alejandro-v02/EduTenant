import clienteApi from './clienteApi';
import type { Curso } from '../tipos/tipos';

export interface DatosCurso {
  nombre: string;
  descripcion?: string;
  profesorId?: string;
}

export function crearCurso(datos: DatosCurso): Promise<Curso> {
  return clienteApi.post<Curso>('/cursos', datos).then((r) => r.data);
}

/** El backend filtra automáticamente: coordinador ve todos, profesor sólo los propios. */
export function listarCursos(): Promise<Curso[]> {
  return clienteApi.get<Curso[]>('/cursos').then((r) => r.data);
}

export function obtenerCurso(id: string): Promise<Curso> {
  return clienteApi.get<Curso>(`/cursos/${id}`).then((r) => r.data);
}

export function actualizarCurso(id: string, datos: Partial<DatosCurso>): Promise<Curso> {
  return clienteApi.patch<Curso>(`/cursos/${id}`, datos).then((r) => r.data);
}

export function eliminarCurso(id: string): Promise<void> {
  return clienteApi.delete(`/cursos/${id}`).then(() => undefined);
}
