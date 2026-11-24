import { DatosCrearInstitucion, Institucion } from './institucion.entity';

/** Puerto (contrato) que implementa la infraestructura de persistencia. */
export abstract class InstitucionRepositorio {
  abstract crear(datos: DatosCrearInstitucion): Promise<Institucion>;
  abstract buscarPorId(id: string): Promise<Institucion | null>;
  abstract buscarPorSlug(slug: string): Promise<Institucion | null>;
  abstract listarTodas(): Promise<Institucion[]>;
  abstract actualizar(
    id: string,
    cambios: Partial<
      Pick<Institucion, 'nombre' | 'plan' | 'activo' | 'direccion' | 'telefono' | 'email' | 'departamento' | 'municipio' | 'descripcion'>
    >,
  ): Promise<Institucion>;
}
