import { DatosCrearMaterial, Material } from './material.entity';

/** Puerto (contrato) que implementa la infraestructura de persistencia. */
export abstract class MaterialRepositorio {
  abstract crear(datos: DatosCrearMaterial): Promise<Material>;
  abstract listarPorCurso(institucionId: string, cursoId: string): Promise<Material[]>;
  abstract eliminar(id: string, institucionId: string): Promise<void>;
}
