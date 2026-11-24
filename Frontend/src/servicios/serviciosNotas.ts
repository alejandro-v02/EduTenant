import clienteApi from './clienteApi';
import type { Nota } from '../tipos/tipos';

export interface DatosNota {
  cursoId: string;
  estudianteId: string;
  valor: number;
  descripcion: string;
  fecha: string;
}

export function crearNota(datos: DatosNota): Promise<Nota> {
  return clienteApi.post<Nota>('/notas', datos).then((r) => r.data);
}

export function actualizarNota(id: string, cambios: { valor?: number; descripcion?: string }): Promise<Nota> {
  return clienteApi.patch<Nota>(`/notas/${id}`, cambios).then((r) => r.data);
}

export function listarNotasPorCurso(cursoId: string): Promise<Nota[]> {
  return clienteApi.get<Nota[]>(`/notas/curso/${cursoId}`).then((r) => r.data);
}

export function listarMisNotas(): Promise<Nota[]> {
  return clienteApi.get<Nota[]>('/notas/mias').then((r) => r.data);
}
