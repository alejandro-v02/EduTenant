import { Injectable, NotFoundException } from '@nestjs/common';
import { Institucion } from '../dominio/institucion.entity';
import { InstitucionRepositorio } from '../dominio/institucion.repositorio';

interface DatosActualizarInstitucion {
  nombre?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  departamento?: string;
  municipio?: string;
  descripcion?: string;
}

@Injectable()
export class InstitucionesService {
  constructor(private readonly institucionRepositorio: InstitucionRepositorio) {}

  async obtenerActual(institucionId: string): Promise<Institucion> {
    const institucion = await this.institucionRepositorio.buscarPorId(institucionId);
    if (!institucion) {
      throw new NotFoundException('Institución no encontrada');
    }
    return institucion;
  }

  async actualizarActual(institucionId: string, cambios: DatosActualizarInstitucion): Promise<Institucion> {
    return this.institucionRepositorio.actualizar(institucionId, cambios);
  }
}
