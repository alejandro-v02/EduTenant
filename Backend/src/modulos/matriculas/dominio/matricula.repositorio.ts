import { DatosCrearMatricula, Matricula } from './matricula.entity';

/** Puerto (contrato) que implementa la infraestructura de persistencia. */
export abstract class MatriculaRepositorio {
  abstract crear(datos: DatosCrearMatricula): Promise<Matricula>;
  abstract existe(institucionId: string, cursoId: string, estudianteId: string): Promise<boolean>;
  abstract listarPorCurso(institucionId: string, cursoId: string): Promise<Matricula[]>;
  abstract listarPorEstudiante(institucionId: string, estudianteId: string): Promise<Matricula[]>;
  abstract eliminar(id: string, institucionId: string): Promise<void>;
}
