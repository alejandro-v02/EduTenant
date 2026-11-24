/** Entidad de dominio pura: sin decoradores de TypeORM ni de Nest. */
export class Institucion {
  constructor(
    public readonly id: string,
    public nombre: string,
    public slug: string,
    public plan: string,
    public activo: boolean,
    public direccion: string | null = null,
    public telefono: string | null = null,
    public email: string | null = null,
    public departamento: string | null = null,
    public municipio: string | null = null,
    public descripcion: string | null = null,
    public readonly creadoEn: Date | null = null,
  ) {}

  desactivar(): void {
    this.activo = false;
  }

  activar(): void {
    this.activo = true;
  }
}

export interface DatosCrearInstitucion {
  nombre: string;
  slug: string;
  plan: string;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
  departamento?: string | null;
  municipio?: string | null;
  descripcion?: string | null;
}
