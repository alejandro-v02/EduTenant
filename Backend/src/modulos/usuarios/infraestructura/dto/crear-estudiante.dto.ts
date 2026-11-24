import { IsEmail, IsString, MinLength } from 'class-validator';

export class CrearEstudianteDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  clave: string;
}
