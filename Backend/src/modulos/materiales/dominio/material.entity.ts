/** Entidad de dominio pura: sin decoradores de TypeORM ni de Nest. */
export class Material {
  constructor(
    public readonly id: string,
    public institucionId: string,
    public cursoId: string,
    public titulo: string,
    public archivoUrl: string,
    public publicadoPor: string,
    public fecha: Date,
  ) {}
}

export interface DatosCrearMaterial {
  institucionId: string;
  cursoId: string;
  titulo: string;
  archivoUrl: string;
  publicadoPor: string;
  fecha: Date;
}
