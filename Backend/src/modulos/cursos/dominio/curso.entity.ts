/** Entidad de dominio pura: sin decoradores de TypeORM ni de Nest. */
export class Curso {
  constructor(
    public readonly id: string,
    public institucionId: string,
    public nombre: string,
    public descripcion: string | null,
    public profesorId: string | null,
  ) {}
}

export interface DatosCrearCurso {
  institucionId: string;
  nombre: string;
  descripcion?: string | null;
  profesorId?: string | null;
}
