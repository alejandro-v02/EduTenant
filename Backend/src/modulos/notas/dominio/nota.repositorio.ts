import { DatosCrearNota, Nota } from './nota.entity';

/** Puerto (contrato) que implementa la infraestructura de persistencia. */
export abstract class NotaRepositorio {
  abstract crear(datos: DatosCrearNota): Promise<Nota>;
  abstract buscarPorIdEnInstitucion(id: string, institucionId: string): Promise<Nota | null>;
  abstract actualizar(
    id: string,
    institucionId: string,
    cambios: Partial<Pick<Nota, 'valor' | 'descripcion'>>,
  ): Promise<Nota>;
  abstract listarPorCurso(institucionId: string, cursoId: string): Promise<Nota[]>;
  abstract listarPorEstudiante(institucionId: string, estudianteId: string): Promise<Nota[]>;
}
