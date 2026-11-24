import { IsString, MinLength } from 'class-validator';

export class RestablecerClaveDto {
  @IsString()
  @MinLength(8)
  claveNueva: string;
}
