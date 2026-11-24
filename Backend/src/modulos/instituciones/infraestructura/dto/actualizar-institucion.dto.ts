import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class ActualizarInstitucionDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  direccion?: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  departamento?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  municipio?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
