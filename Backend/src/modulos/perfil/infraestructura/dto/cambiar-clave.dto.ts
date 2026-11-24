import { IsString, MinLength } from 'class-validator';

export class CambiarClaveDto {
  @IsString()
  claveActual: string;

  @IsString()
  @MinLength(8)
  claveNueva: string;
}
