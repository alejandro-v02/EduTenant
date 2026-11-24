import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class ActualizarCursoDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsUUID()
  profesorId?: string;
}
