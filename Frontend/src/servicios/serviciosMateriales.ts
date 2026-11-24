import clienteApi from './clienteApi';
import type { Material } from '../tipos/tipos';

export function publicarMaterial(cursoId: string, titulo: string, archivoUrl: string): Promise<Material> {
  return clienteApi.post<Material>('/materiales', { cursoId, titulo, archivoUrl }).then((r) => r.data);
}

export function listarMaterialesPorCurso(cursoId: string): Promise<Material[]> {
  return clienteApi.get<Material[]>(`/materiales/curso/${cursoId}`).then((r) => r.data);
}

export function eliminarMaterial(cursoId: string, id: string): Promise<void> {
  return clienteApi.delete(`/materiales/curso/${cursoId}/${id}`).then(() => undefined);
}
