import { IsDateString, IsNumber, IsString, IsUUID, Max, Min, MinLength } from 'class-validator';

export class CrearNotaDto {
  @IsUUID()
  cursoId: string;

  @IsUUID()
  estudianteId: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  valor: number;

  @IsString()
  @MinLength(2)
  descripcion: string;

  @IsDateString()
  fecha: string;
}
