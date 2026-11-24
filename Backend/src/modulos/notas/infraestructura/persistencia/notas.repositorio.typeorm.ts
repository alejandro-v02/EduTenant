import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatosCrearNota, Nota } from '../../dominio/nota.entity';
import { NotaRepositorio } from '../../dominio/nota.repositorio';
import { NotaOrmEntity } from './nota.orm-entity';

@Injectable()
export class NotasRepositorioTypeOrm implements NotaRepositorio {
  constructor(
    @InjectRepository(NotaOrmEntity)
    private readonly repositorio: Repository<NotaOrmEntity>,
  ) {}

  async crear(datos: DatosCrearNota): Promise<Nota> {
    const entidad = this.repositorio.create({
      ...datos,
      fecha: this.aFechaOrm(datos.fecha),
    });
    const guardada = await this.repositorio.save(entidad);
    return this.aDominio(guardada);
  }

  async buscarPorIdEnInstitucion(id: string, institucionId: string): Promise<Nota | null> {
    const encontrada = await this.repositorio.findOne({ where: { id, institucionId } });
    return encontrada ? this.aDominio(encontrada) : null;
  }

  async actualizar(
    id: string,
    institucionId: string,
    cambios: Partial<Pick<Nota, 'valor' | 'descripcion'>>,
  ): Promise<Nota> {
    const entidad = await this.repositorio.findOne({ where: { id, institucionId } });
    if (!entidad) {
      throw new NotFoundException('Nota no encontrada');
    }
    Object.assign(entidad, cambios);
    const guardada = await this.repositorio.save(entidad);
    return this.aDominio(guardada);
  }

  async listarPorCurso(institucionId: string, cursoId: string): Promise<Nota[]> {
    const encontradas = await this.repositorio.find({ where: { institucionId, cursoId } });
    return encontradas.map((entidad) => this.aDominio(entidad));
  }

  async listarPorEstudiante(institucionId: string, estudianteId: string): Promise<Nota[]> {
    const encontradas = await this.repositorio.find({ where: { institucionId, estudianteId } });
    return encontradas.map((entidad) => this.aDominio(entidad));
  }

  private aFechaOrm(fecha: Date): string {
    return fecha.toISOString().slice(0, 10);
  }

  private aDominio(entidad: NotaOrmEntity): Nota {
    return new Nota(
      entidad.id,
      entidad.institucionId,
      entidad.cursoId,
      entidad.estudianteId,
      Number(entidad.valor),
      entidad.descripcion,
      new Date(entidad.fecha),
    );
  }
}
