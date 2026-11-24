/** Entidad de dominio pura: sin decoradores de TypeORM ni de Nest. */
export class Matricula {
  constructor(
    public readonly id: string,
    public institucionId: string,
    public cursoId: string,
    public estudianteId: string,
    public fechaMatricula: Date,
  ) {}
}

export interface DatosCrearMatricula {
  institucionId: string;
  cursoId: string;
  estudianteId: string;
}
