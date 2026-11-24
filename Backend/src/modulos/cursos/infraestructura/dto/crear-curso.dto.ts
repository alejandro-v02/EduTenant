import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CrearCursoDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsUUID()
  profesorId?: string;
}
