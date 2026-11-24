import clienteApi from './clienteApi';
import type {
  DatosActualizarInstitucion,
  DatosCrearInstitucion,
  Institucion,
  ResultadoCrearInstitucion,
  ResumenInstitucion,
} from '../tipos/tipos';

/** Institución del usuario autenticado (coordinador/profesor/estudiante). */
export function obtenerInstitucionActual(): Promise<Institucion> {
  return clienteApi.get<Institucion>('/instituciones/actual').then((r) => r.data);
}

export function actualizarInstitucionActual(datos: DatosActualizarInstitucion): Promise<Institucion> {
  return clienteApi.patch<Institucion>('/instituciones/actual', datos).then((r) => r.data);
}

/** Sólo disponible para el superadministrador: opera entre instituciones. */
export function crearInstitucion(datos: DatosCrearInstitucion): Promise<ResultadoCrearInstitucion> {
  return clienteApi.post<ResultadoCrearInstitucion>('/superadministrador/instituciones', datos).then((r) => r.data);
}

export function listarInstituciones(): Promise<Institucion[]> {
  return clienteApi.get<Institucion[]>('/superadministrador/instituciones').then((r) => r.data);
}

export function obtenerInstitucionPorId(id: string): Promise<ResumenInstitucion> {
  return clienteApi.get<ResumenInstitucion>(`/superadministrador/instituciones/${id}`).then((r) => r.data);
}
