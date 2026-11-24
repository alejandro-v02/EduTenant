import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class ActualizarNotaDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  valor?: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  descripcion?: string;
}
