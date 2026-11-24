import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TipoDocumento } from '../../../../compartido/tipos/tipo-documento.enum';

export class CrearInstitucionDto {
  // --- Datos de la institución ---
  @IsString()
  @MinLength(2)
  nombreInstitucion: string;

  @IsString()
  @MinLength(2)
  slug: string;

  @IsOptional()
  @IsString()
  plan?: string;

  @IsString()
  @MinLength(5)
  direccionInstitucion: string;

  @IsString()
  @MinLength(7)
  telefonoInstitucion: string;

  @IsEmail()
  emailInstitucion: string;

  @IsString()
  @MinLength(2)
  departamentoInstitucion: string;

  @IsString()
  @MinLength(2)
  municipioInstitucion: string;

  @IsOptional()
  @IsString()
  descripcionInstitucion?: string;

  // --- Datos completos del coordinador inicial ---
  @IsString()
  @MinLength(2)
  nombreCoordinador: string;

  @IsString()
  @MinLength(2)
  apellidoCoordinador: string;

  @IsEnum(TipoDocumento)
  tipoDocumentoCoordinador: TipoDocumento;

  @IsString()
  @MinLength(4)
  numeroDocumentoCoordinador: string;

  @IsString()
  @MinLength(7)
  telefonoCoordinador: string;

  @IsString()
  @MinLength(5)
  direccionCoordinador: string;

  @IsString()
  @MinLength(2)
  departamentoCoordinador: string;

  @IsString()
  @MinLength(2)
  municipioCoordinador: string;

  @IsOptional()
  @IsDateString()
  fechaNacimientoCoordinador?: string;

  @IsEmail()
  emailCoordinador: string;

  @IsString()
  @MinLength(8)
  claveCoordinador: string;
}
