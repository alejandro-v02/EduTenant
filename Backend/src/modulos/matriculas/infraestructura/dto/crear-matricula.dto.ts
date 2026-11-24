import { IsUUID } from 'class-validator';

export class CrearMatriculaDto {
  @IsUUID()
  cursoId: string;

  @IsUUID()
  estudianteId: string;
}
