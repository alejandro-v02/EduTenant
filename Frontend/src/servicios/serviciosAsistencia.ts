import clienteApi from './clienteApi';
import type { Asistencia, EstadoAsistencia } from '../tipos/tipos';

/** Idempotente en el backend: si ya existe un registro para ese curso/estudiante/fecha, lo actualiza. */
export function registrarAsistencia(
  cursoId: string,
  estudianteId: string,
  fecha: string,
  estado: EstadoAsistencia,
): Promise<Asistencia> {
  return clienteApi.post<Asistencia>('/asistencia', { cursoId, estudianteId, fecha, estado }).then((r) => r.data);
}

export function listarAsistenciaPorCurso(cursoId: string): Promise<Asistencia[]> {
  return clienteApi.get<Asistencia[]>(`/asistencia/curso/${cursoId}`).then((r) => r.data);
}

export function listarMiAsistencia(): Promise<Asistencia[]> {
  return clienteApi.get<Asistencia[]>('/asistencia/mia').then((r) => r.data);
}
