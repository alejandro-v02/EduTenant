import { IsDateString, IsEnum, IsUUID } from 'class-validator';
import { EstadoAsistencia } from '../../../../compartido/tipos/estado-asistencia.enum';

export class RegistrarAsistenciaDto {
  @IsUUID()
  cursoId: string;

  @IsUUID()
  estudianteId: string;

  @IsDateString()
  fecha: string;

  @IsEnum(EstadoAsistencia)
  estado: EstadoAsistencia;
}
