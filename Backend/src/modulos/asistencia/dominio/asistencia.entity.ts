import { EstadoAsistencia } from '../../../compartido/tipos/estado-asistencia.enum';

/** Entidad de dominio pura: sin decoradores de TypeORM ni de Nest. */
export class Asistencia {
  constructor(
    public readonly id: string,
    public institucionId: string,
    public cursoId: string,
    public estudianteId: string,
    public fecha: Date,
    public estado: EstadoAsistencia,
  ) {}
}

export interface DatosRegistrarAsistencia {
  institucionId: string;
  cursoId: string;
  estudianteId: string;
  fecha: Date;
  estado: EstadoAsistencia;
}
