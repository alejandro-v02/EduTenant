import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatosCrearInstitucion, Institucion } from '../../dominio/institucion.entity';
import { InstitucionRepositorio } from '../../dominio/institucion.repositorio';
import { InstitucionOrmEntity } from './institucion.orm-entity';

@Injectable()
export class InstitucionesRepositorioTypeOrm implements InstitucionRepositorio {
  constructor(
    @InjectRepository(InstitucionOrmEntity)
    private readonly repositorio: Repository<InstitucionOrmEntity>,
  ) {}

  async crear(datos: DatosCrearInstitucion): Promise<Institucion> {
    const entidad = this.repositorio.create(datos);
    const guardada = await this.repositorio.save(entidad);
    return this.aDominio(guardada);
  }

  async buscarPorId(id: string): Promise<Institucion | null> {
    const encontrada = await this.repositorio.findOne({ where: { id } });
    return encontrada ? this.aDominio(encontrada) : null;
  }

  async buscarPorSlug(slug: string): Promise<Institucion | null> {
    const encontrada = await this.repositorio.findOne({ where: { slug } });
    return encontrada ? this.aDominio(encontrada) : null;
  }

  async listarTodas(): Promise<Institucion[]> {
    const encontradas = await this.repositorio.find();
    return encontradas.map((entidad) => this.aDominio(entidad));
  }

  async actualizar(
    id: string,
    cambios: Partial<Pick<Institucion, 'nombre' | 'plan' | 'activo'>>,
  ): Promise<Institucion> {
    const entidad = await this.repositorio.findOne({ where: { id } });
    if (!entidad) {
      throw new NotFoundException('Institución no encontrada');
    }
    Object.assign(entidad, cambios);
    const guardada = await this.repositorio.save(entidad);
    return this.aDominio(guardada);
  }

  private aDominio(entidad: InstitucionOrmEntity): Institucion {
    return new Institucion(
      entidad.id,
      entidad.nombre,
      entidad.slug,
      entidad.plan,
      entidad.activo,
      entidad.direccion,
      entidad.telefono,
      entidad.email,
      entidad.departamento,
      entidad.municipio,
      entidad.descripcion,
      entidad.creadoEn,
    );
  }
}
