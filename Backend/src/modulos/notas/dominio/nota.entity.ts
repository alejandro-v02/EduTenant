/** Entidad de dominio pura: sin decoradores de TypeORM ni de Nest. */
export class Nota {
  constructor(
    public readonly id: string,
    public institucionId: string,
    public cursoId: string,
    public estudianteId: string,
    public valor: number,
    public descripcion: string,
    public fecha: Date,
  ) {}
}

export interface DatosCrearNota {
  institucionId: string;
  cursoId: string;
  estudianteId: string;
  valor: number;
  descripcion: string;
  fecha: Date;
}
