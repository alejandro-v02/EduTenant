import { Curso, DatosCrearCurso } from './curso.entity';

/**
 * Puerto (contrato). Toda operación exige institucionId explícito: es la
 * barrera de aislamiento a nivel de persistencia, además del filtro que ya
 * aplican los casos de uso.
 */
export abstract class CursoRepositorio {
  abstract crear(datos: DatosCrearCurso): Promise<Curso>;
  abstract buscarPorIdEnInstitucion(id: string, institucionId: string): Promise<Curso | null>;
  abstract listarPorInstitucion(institucionId: string): Promise<Curso[]>;
  abstract listarPorProfesor(institucionId: string, profesorId: string): Promise<Curso[]>;
  abstract actualizar(
    id: string,
    institucionId: string,
    cambios: Partial<Pick<Curso, 'nombre' | 'descripcion' | 'profesorId'>>,
  ): Promise<Curso>;
  abstract eliminar(id: string, institucionId: string): Promise<void>;
}
