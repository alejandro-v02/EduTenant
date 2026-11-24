import { IsString, MinLength } from 'class-validator';

export class RestablecerClaveTokenDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  claveNueva: string;
}
