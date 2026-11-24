import { IsString, IsUrl, IsUUID, MinLength } from 'class-validator';

export class CrearMaterialDto {
  @IsUUID()
  cursoId: string;

  @IsString()
  @MinLength(2)
  titulo: string;

  @IsUrl()
  archivoUrl: string;
}
