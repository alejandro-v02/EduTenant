import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatosCrearMaterial, Material } from '../../dominio/material.entity';
import { MaterialRepositorio } from '../../dominio/material.repositorio';
import { MaterialOrmEntity } from './material.orm-entity';

@Injectable()
export class MaterialesRepositorioTypeOrm implements MaterialRepositorio {
  constructor(
    @InjectRepository(MaterialOrmEntity)
    private readonly repositorio: Repository<MaterialOrmEntity>,
  ) {}

  async crear(datos: DatosCrearMaterial): Promise<Material> {
    const entidad = this.repositorio.create(datos);
    const guardada = await this.repositorio.save(entidad);
    return this.aDominio(guardada);
  }

  async listarPorCurso(institucionId: string, cursoId: string): Promise<Material[]> {
    const encontradas = await this.repositorio.find({ where: { institucionId, cursoId } });
    return encontradas.map((entidad) => this.aDominio(entidad));
  }

  async eliminar(id: string, institucionId: string): Promise<void> {
    const entidad = await this.repositorio.findOne({ where: { id, institucionId } });
    if (!entidad) {
      throw new NotFoundException('Material no encontrado');
    }
    await this.repositorio.remove(entidad);
  }

  private aDominio(entidad: MaterialOrmEntity): Material {
    return new Material(
      entidad.id,
      entidad.institucionId,
      entidad.cursoId,
      entidad.titulo,
      entidad.archivoUrl,
      entidad.publicadoPor,
      entidad.fecha,
    );
  }
}
