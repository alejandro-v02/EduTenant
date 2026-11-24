import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TipoDocumento } from '../../../../compartido/tipos/tipo-documento.enum';

/** Cada campo es opcional: sirve tanto para completar el perfil por primera vez como para editarlo después. */
export class ActualizarPerfilDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  apellido?: string;

  @IsOptional()
  @IsEnum(TipoDocumento)
  tipoDocumento?: TipoDocumento;

  @IsOptional()
  @IsString()
  @MinLength(4)
  numeroDocumento?: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  direccion?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  departamento?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  municipio?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;
}
