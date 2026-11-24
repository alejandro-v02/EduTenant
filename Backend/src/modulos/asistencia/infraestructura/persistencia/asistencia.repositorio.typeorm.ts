import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoAsistencia } from '../../../../compartido/tipos/estado-asistencia.enum';
import { Asistencia, DatosRegistrarAsistencia } from '../../dominio/asistencia.entity';
import { AsistenciaRepositorio } from '../../dominio/asistencia.repositorio';
import { AsistenciaOrmEntity } from './asistencia.orm-entity';

@Injectable()
export class AsistenciaRepositorioTypeOrm implements AsistenciaRepositorio {
  constructor(
    @InjectRepository(AsistenciaOrmEntity)
    private readonly repositorio: Repository<AsistenciaOrmEntity>,
  ) {}

  async registrar(datos: DatosRegistrarAsistencia): Promise<Asistencia> {
    const entidad = this.repositorio.create({
      ...datos,
      fecha: this.aFechaOrm(datos.fecha),
    });
    const guardada = await this.repositorio.save(entidad);
    return this.aDominio(guardada);
  }

  async buscarPorCursoFechaEstudiante(
    institucionId: string,
    cursoId: string,
    estudianteId: string,
    fecha: Date,
  ): Promise<Asistencia | null> {
    const encontrada = await this.repositorio.findOne({
      where: { institucionId, cursoId, estudianteId, fecha: this.aFechaOrm(fecha) },
    });
    return encontrada ? this.aDominio(encontrada) : null;
  }

  async actualizarEstado(id: string, institucionId: string, estado: EstadoAsistencia): Promise<Asistencia> {
    const entidad = await this.repositorio.findOne({ where: { id, institucionId } });
    if (!entidad) {
      throw new NotFoundException('Registro de asistencia no encontrado');
    }
    entidad.estado = estado;
    const guardada = await this.repositorio.save(entidad);
    return this.aDominio(guardada);
  }

  async listarPorCurso(institucionId: string, cursoId: string): Promise<Asistencia[]> {
    const encontradas = await this.repositorio.find({ where: { institucionId, cursoId } });
    return encontradas.map((entidad) => this.aDominio(entidad));
  }

  async listarPorEstudiante(institucionId: string, estudianteId: string): Promise<Asistencia[]> {
    const encontradas = await this.repositorio.find({ where: { institucionId, estudianteId } });
    return encontradas.map((entidad) => this.aDominio(entidad));
  }

  private aFechaOrm(fecha: Date): string {
    return fecha.toISOString().slice(0, 10);
  }

  private aDominio(entidad: AsistenciaOrmEntity): Asistencia {
    return new Asistencia(
      entidad.id,
      entidad.institucionId,
      entidad.cursoId,
      entidad.estudianteId,
      new Date(entidad.fecha),
      entidad.estado,
    );
  }
}
