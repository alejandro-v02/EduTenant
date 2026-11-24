import { EstadoAsistencia } from '../../../compartido/tipos/estado-asistencia.enum';
import { Asistencia, DatosRegistrarAsistencia } from './asistencia.entity';

/** Puerto (contrato) que implementa la infraestructura de persistencia. */
export abstract class AsistenciaRepositorio {
  abstract registrar(datos: DatosRegistrarAsistencia): Promise<Asistencia>;
  abstract buscarPorCursoFechaEstudiante(
    institucionId: string,
    cursoId: string,
    estudianteId: string,
    fecha: Date,
  ): Promise<Asistencia | null>;
  abstract actualizarEstado(id: string, institucionId: string, estado: EstadoAsistencia): Promise<Asistencia>;
  abstract listarPorCurso(institucionId: string, cursoId: string): Promise<Asistencia[]>;
  abstract listarPorEstudiante(institucionId: string, estudianteId: string): Promise<Asistencia[]>;
}
