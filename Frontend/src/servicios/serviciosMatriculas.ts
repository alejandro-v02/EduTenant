import clienteApi from './clienteApi';
import type { Matricula } from '../tipos/tipos';

export function matricularEstudiante(cursoId: string, estudianteId: string): Promise<Matricula> {
  return clienteApi.post<Matricula>('/matriculas', { cursoId, estudianteId }).then((r) => r.data);
}

export function listarMatriculasPorCurso(cursoId: string): Promise<Matricula[]> {
  return clienteApi.get<Matricula[]>(`/matriculas/curso/${cursoId}`).then((r) => r.data);
}

export function listarMisMatriculas(): Promise<Matricula[]> {
  return clienteApi.get<Matricula[]>('/matriculas/mias').then((r) => r.data);
}

export function retirarMatricula(id: string): Promise<void> {
  return clienteApi.delete(`/matriculas/${id}`).then(() => undefined);
}
